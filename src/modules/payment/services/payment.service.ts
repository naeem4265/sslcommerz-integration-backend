import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PaymentMethod } from '../types/payment-method.enum';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentTransaction } from '../entities/payment-transaction.entity';
import { PaymentTransactionResponseDto } from '../dtos/payment-transaction-response.dto';
import { SSLCommerzService } from './sslcommerz.service';
import { RegistrationService } from '../../registration/services/registration.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly sslcommerzService: SSLCommerzService,
    private readonly registrationService: RegistrationService,
  ) {}

  async initiatePayment(
    registrationId: string,
    amount: number,
  ): Promise<PaymentTransactionResponseDto> {
    try {
      this.logger.log(`Initiating payment for registration: ${registrationId}`);
      
      // Get registration details
      const registration = await this.registrationService.findOne(registrationId);

      // Create initial payment transaction
      const transaction = await this.paymentRepository.createTransaction(
        registrationId,
        amount
      );

      // Initialize SSLCommerz payment
      const paymentUrl = await this.sslcommerzService.initiatePayment(
        registration,
        amount,
      );

      // Update transaction with payment URL
      transaction.paymentUrl = paymentUrl;
      await this.paymentRepository.save(transaction);

      this.logger.debug(`Payment initiated, transaction ID: ${transaction.transactionId}`);
      return this.toResponseDto(transaction);
    } catch (error) {
      this.logger.error(`Failed to initiate payment: ${error.message}`);
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
      this.logger.log(`Processing payment callback for transaction: ${transactionId}`);
      const transaction = await this.paymentRepository.findTransactionById(
        transactionId,
      );

      if (!transaction) {
        this.logger.warn(`Transaction not found: ${transactionId}`);
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
        this.logger.warn(`Payment validation failed for transaction: ${transactionId}`);
        throw new BadRequestException('Payment validation failed');
      }

      // Update transaction with payment completion
      const updatedTransaction = await this.paymentRepository.updateTransaction(
        transaction,
        'Payment verified successfully'
      );

      // Update registration payment status
      await this.registrationService.updatePaymentStatus(
        transaction.registrationId,
        PaymentMethod.SSLCOMMERZ, // Send direct enum value
        transactionId,
      );

      this.logger.log(`Payment verified successfully for transaction: ${transactionId}`);
      return this.toResponseDto(updatedTransaction);
    } catch (error) {
      this.logger.error(`Payment verification failed: ${error.message}`);
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
      amount: transaction.amount,
      paymentUrl: transaction.paymentUrl,
      gatewayResponse: transaction.gatewayResponse,
      completedAt: transaction.completedAt,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    });
    return response;
  }
} 