import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentMethod } from '../types/payment-method.enum';
import { PaymentTransaction, PaymentTransactionDocument } from '../entities/payment-transaction.entity';

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
    @InjectModel(PaymentTransaction.name)
    private readonly paymentTransactionModel: Model<PaymentTransactionDocument>,
  ) {}

  async createTransaction(
    registrationId: string,
    amount: number,
    paymentMethod: PaymentMethod,
  ): Promise<PaymentTransaction> {
    const transactionId = this.generateTransactionId();
    const paymentUrl = await this.getPaymentUrl(paymentMethod, transactionId);

    const transaction = new this.paymentTransactionModel({
      registrationId,
      transactionId,
      paymentMethod,
      amount,
      paymentUrl,
      status: 'PENDING',
    });

    return transaction.save();
  }

  async findTransactionById(transactionId: string): Promise<PaymentTransaction | null> {
    return this.paymentTransactionModel.findOne({ transactionId }).exec();
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

    return transaction.save();
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
} 