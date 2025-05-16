import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../types/payment-method.enum';
import { PaymentTransaction } from '../entities/payment-transaction.entity';

@Injectable()
export class PaymentRepository {
  private paymentGateways = {
    [PaymentMethod.SSLCOMMERZ]: {
      baseUrl: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
      verifyUrl: 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php',
    },
    [PaymentMethod.BKASH]: {
      baseUrl: 'https://bkash.com/pay',
      verifyUrl: 'https://bkash.com/verify',
    },
    [PaymentMethod.NAGAD]: {
      baseUrl: 'https://nagad.com/pay',
      verifyUrl: 'https://nagad.com/verify',
    },
    [PaymentMethod.ROCKET]: {
      baseUrl: 'https://rocket.com/pay',
      verifyUrl: 'https://rocket.com/verify',
    },
    [PaymentMethod.DBBL]: {
      baseUrl: 'https://dbbl.com/pay',
      verifyUrl: 'https://dbbl.com/verify',
    },
  } as const;

  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionRepository: Repository<PaymentTransaction>,
  ) {}

  async createTransaction(
    registrationId: string,
    amount: number,
    paymentMethod: PaymentMethod,
  ): Promise<PaymentTransaction> {
    const transactionId = this.generateTransactionId();
    const paymentUrl = await this.getPaymentUrl(paymentMethod, transactionId);

    const transaction = this.paymentTransactionRepository.create({
      registrationId,
      transactionId,
      paymentMethod,
      amount,
      paymentUrl,
      status: 'PENDING',
    });

    return this.paymentTransactionRepository.save(transaction);
  }

  async findTransactionById(transactionId: string): Promise<PaymentTransaction | null> {
    return this.paymentTransactionRepository.findOne({
      where: { transactionId },
      relations: ['registration'],
    });
  }

  async updateTransactionStatus(
    transaction: PaymentTransaction,
    status: 'COMPLETED' | 'FAILED',
    gatewayResponse?: string,
    failureReason?: string,
  ): Promise<PaymentTransaction> {
    transaction.status = status;
    transaction.gatewayResponse = gatewayResponse;

    if (status === 'COMPLETED') {
      transaction.completedAt = new Date();
    } else {
      transaction.failedAt = new Date();
      transaction.failureReason = failureReason;
    }

    return this.paymentTransactionRepository.save(transaction);
  }

  private async getPaymentUrl(
    paymentMethod: PaymentMethod,
    transactionId: string,
  ): Promise<string> {
    const gateway = this.paymentGateways[paymentMethod];
    if (!gateway) {
      throw new Error('Unsupported payment method');
    }
    return `${gateway.baseUrl}/${transactionId}`;
  }

  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async save(transaction: PaymentTransaction): Promise<PaymentTransaction> {
    return this.paymentTransactionRepository.save(transaction);
  }
} 