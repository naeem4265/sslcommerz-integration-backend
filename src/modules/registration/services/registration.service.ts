import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateRegistrationDto } from '../dtos/create-registration.dto';
import { RegistrationRepository } from '../repositories/registration.repository';
import { Registration } from '../entities/registration.entity';
import { PaymentMethod } from '../../payment/types/payment-method.enum';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(private readonly registrationRepository: RegistrationRepository) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    this.logger.log(`Creating new registration for ${createRegistrationDto.fullName}`);
    const registration = await this.registrationRepository.create(createRegistrationDto);
    this.logger.debug(`Registration created with ID: ${registration.id}`);
    return registration;
  }

  async findAll(): Promise<Registration[]> {
    this.logger.log('Fetching all registrations');
    const registrations = await this.registrationRepository.findAll();
    this.logger.debug(`Found ${registrations.length} registrations`);
    return registrations;
  }

  async findOne(id: string): Promise<Registration> {
    this.logger.log(`Fetching registration with ID: ${id}`);
    const registration = await this.registrationRepository.findById(id);
    if (!registration) {
      this.logger.warn(`Registration #${id} not found`);
      throw new NotFoundException(`Registration #${id} not found`);
    }
    return registration;
  }

  async updatePaymentStatus(
    id: string,
    paymentMethod: PaymentMethod,
    transactionId: string,
  ): Promise<Registration> {
    this.logger.log(`Updating payment status for registration ID: ${id}`);
    this.logger.debug(`Payment method: ${paymentMethod}, Transaction ID: ${transactionId}`);
    
    const registration = await this.findOne(id);
    
    const updatedRegistration = await this.registrationRepository.save(
      Object.assign(registration, {
        paymentMethod,
        paymentTransactionId: transactionId,
        paymentCompleted: true,
        paymentCompletedAt: new Date(),
        status: 'APPROVED' as const
      })
    );

    this.logger.log(`Payment status updated successfully for registration ID: ${id}`);
    return updatedRegistration;
  }
} 