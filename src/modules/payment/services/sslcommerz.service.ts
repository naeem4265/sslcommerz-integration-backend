import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { getSslcommerzConfig } from '../../../config/sslcommerz.config';
import { Registration } from '../../registration/entities/registration.entity';

@Injectable()
export class SSLCommerzService {
  private readonly config;
  private readonly apiEndpoints = {
    createPayment: '/gwprocess/v4/api.php',
    validatePayment: '/validator/api/validationserverAPI.php',
  };

  constructor(private readonly configService: ConfigService) {
    this.config = getSslcommerzConfig(configService);
  }

  async initiatePayment(registration: Registration, amount: number): Promise<string> {
    try {
      const payload = {
        store_id: this.config.storeId,
        store_passwd: this.config.storePassword,
        total_amount: amount,
        currency: 'BDT',
        tran_id: `REG-${registration.id}-${Date.now()}`,
        success_url: this.config.successUrl,
        fail_url: this.config.failUrl,
        cancel_url: this.config.cancelUrl,
        ipn_url: this.config.ipnUrl,
        shipping_method: 'NO',
        product_name: 'ThPI Alumni Registration',
        product_category: 'Registration',
        product_profile: 'general',
        cus_name: registration.fullName,
        cus_email: registration.email,
        cus_add1: registration.address,
        cus_phone: registration.phone,
        cus_city: 'Thakurgaon',
        cus_country: 'Bangladesh',
      };

      const response = await axios.post(
        `${this.config.baseUrl}${this.apiEndpoints.createPayment}`,
        payload,
      );

      console.log('payload----------------------->', payload, response.data);

      if (response.data.status === 'SUCCESS') {
        return response.data.GatewayPageURL;
      }

      throw new BadRequestException(
        response.data.failedreason || 'Failed to initiate payment',
      );
    } catch (error) {
      throw new BadRequestException(
        error.response?.data?.failedreason || 'Failed to initiate payment',
      );
    }
  }

  async validatePayment(
    transactionId: string,
    amount: number,
    status: string,
    validationId: string,
  ): Promise<boolean> {
    try {
      const payload = {
        store_id: this.config.storeId,
        store_passwd: this.config.storePassword,
        val_id: validationId,
      };

      const response = await axios.post(
        `${this.config.baseUrl}${this.apiEndpoints.validatePayment}`,
        payload,
      );

      if (
        response.data.status === 'VALID' ||
        response.data.status === 'VALIDATED'
      ) {
        return (
          response.data.tran_id === transactionId &&
          Number(response.data.amount) === amount &&
          response.data.status === status
        );
      }

      return false;
    } catch (error) {
      throw new BadRequestException('Failed to validate payment');
    }
  }

  async handleIPN(ipnData: any): Promise<boolean> {
    // Verify the IPN data with SSLCommerz
    const isValid = await this.validatePayment(
      ipnData.tran_id,
      Number(ipnData.amount),
      ipnData.status,
      ipnData.val_id,
    );

    return isValid;
  }
} 