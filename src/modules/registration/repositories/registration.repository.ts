import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from '../entities/registration.entity';
import { CreateRegistrationDto } from '../dtos/create-registration.dto';
import { PaymentMethod } from '../../payment/types/payment-method.enum';

@Injectable()
export class RegistrationRepository {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    const registration = this.registrationRepository.create(createRegistrationDto);
    return this.registrationRepository.save(registration);
  }

  async findAll(): Promise<Registration[]> {
    return this.registrationRepository.find();
  }

  async findById(id: string): Promise<Registration | null> {
    return this.registrationRepository.findOneBy({ id });
  }

  async save(registration: Registration): Promise<Registration> {
    return this.registrationRepository.save(registration);
  }
} 