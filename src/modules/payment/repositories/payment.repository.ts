import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTransaction } from '../entities/payment-transaction.entity';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(PaymentTransaction)
    private readonly paymentTransactionRepository: Repository<PaymentTransaction>,
  ) {}

  async createTransaction(
    registrationId: string,
    amount: number,
  ): Promise<PaymentTransaction> {
    const transactionId = this.generateTransactionId();

    const transaction = this.paymentTransactionRepository.create({
      registrationId,
      transactionId,
      amount,
    });

    return this.paymentTransactionRepository.save(transaction);
  }

  async findTransactionById(transactionId: string): Promise<PaymentTransaction | null> {
    return this.paymentTransactionRepository.findOne({
      where: { transactionId },
      relations: ['registration'],
    });
  }

  async updateTransaction(
    transaction: PaymentTransaction,
    gatewayResponse?: string,
  ): Promise<PaymentTransaction> {
    transaction.gatewayResponse = gatewayResponse;
    transaction.completedAt = new Date();

    return this.paymentTransactionRepository.save(transaction);
  }

  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async save(transaction: PaymentTransaction): Promise<PaymentTransaction> {
    return this.paymentTransactionRepository.save(transaction);
  }
} 