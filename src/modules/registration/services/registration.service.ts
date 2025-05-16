import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRegistrationDto } from '../dtos/create-registration.dto';
import { RegistrationRepository } from '../repositories/registration.repository';
import { Registration, RegistrationDocument } from '../entities/registration.entity';
import { PaymentMethod } from '../../payment/types/payment-method.enum';
import { Model } from 'mongoose';

@Injectable()
export class RegistrationService {
  constructor(private readonly registrationRepository: RegistrationRepository) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    return this.registrationRepository.create(createRegistrationDto);
  }

  async findAll(): Promise<Registration[]> {
    return this.registrationRepository.findAll();
  }

  async findOne(id: string): Promise<Registration> {
    const registration = await this.registrationRepository.findById(id);
    if (!registration) {
      throw new NotFoundException(`Registration #${id} not found`);
    }
    return registration;
  }

  async updatePaymentStatus(
    id: string,
    paymentMethod: PaymentMethod,
    transactionId: string,
  ): Promise<Registration> {
    const registration = await this.findOne(id);
    const doc = registration as RegistrationDocument;
    
    return this.registrationRepository.save(
      Object.assign(doc, {
        paymentMethod,
        paymentTransactionId: transactionId,
        paymentCompleted: true,
        paymentCompletedAt: new Date(),
        status: 'APPROVED' as const
      })
    );
  }
} 