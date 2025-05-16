import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentMethod } from '../types/payment-method.enum';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentTransaction } from '../entities/payment-transaction.entity';
import { PaymentTransactionResponseDto } from '../dtos/payment-transaction-response.dto';
import { SSLCommerzService } from './sslcommerz.service';
import { RegistrationService } from '../../registration/services/registration.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly sslcommerzService: SSLCommerzService,
    private readonly registrationService: RegistrationService,
  ) {}

  async initiatePayment(
    registrationId: string,
    amount: number,
    paymentMethod: PaymentMethod,
  ): Promise<PaymentTransactionResponseDto> {
    try {
      // Get registration details
      const registration = await this.registrationService.findOne(registrationId);

      // Create payment transaction
      const transaction = await this.paymentRepository.createTransaction(
        registrationId,
        amount,
        paymentMethod,
      );

      // Initialize SSLCommerz payment
      const paymentUrl = await this.sslcommerzService.initiatePayment(
        registration,
        amount,
      );

      // Update transaction with payment URL
      transaction.paymentUrl = paymentUrl;
      await transaction.save();

      return this.toResponseDto(transaction);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to initiate payment',
      );
    }
  }

  async handlePaymentCallback(
    transactionId: string,
    status: string,
    validationId: string,
  ): Promise<PaymentTransactionResponseDto> {
    try {
      const transaction = await this.paymentRepository.findTransactionById(
        transactionId,
      );

      if (!transaction) {
        throw new NotFoundException(`Transaction ${transactionId} not found`);
      }

      // Validate payment with SSLCommerz
      const isValid = await this.sslcommerzService.validatePayment(
        transactionId,
        transaction.amount,
        status,
        validationId,
      );

      if (!isValid) {
        throw new BadRequestException('Payment validation failed');
      }

      // Update transaction status
      const updatedTransaction = await this.paymentRepository.updateTransactionStatus(
        transaction,
        'COMPLETED',
        'Payment verified successfully',
      );

      // Update registration payment status
      await this.registrationService.updatePaymentStatus(
        transaction.registrationId,
        transaction.paymentMethod,
        transactionId,
      );

      return this.toResponseDto(updatedTransaction);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        error.message || 'Failed to verify payment',
      );
    }
  }

  async handlePaymentIPN(ipnData: any): Promise<void> {
    const isValid = await this.sslcommerzService.handleIPN(ipnData);
    if (isValid) {
      await this.handlePaymentCallback(
        ipnData.tran_id,
        ipnData.status,
        ipnData.val_id,
      );
    }
  }

  private toResponseDto(transaction: PaymentTransaction): PaymentTransactionResponseDto {
    const response = new PaymentTransactionResponseDto();
    Object.assign(response, {
      registrationId: transaction.registrationId,
      transactionId: transaction.transactionId,
      paymentMethod: transaction.paymentMethod,
      amount: transaction.amount,
      status: transaction.status,
      paymentUrl: transaction.paymentUrl,
      gatewayResponse: transaction.gatewayResponse,
      completedAt: transaction.completedAt,
      failedAt: transaction.failedAt,
      failureReason: transaction.failureReason,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
    return response;
  }
} 