import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Registration, RegistrationDocument } from '../entities/registration.entity';
import { CreateRegistrationDto } from '../dtos/create-registration.dto';
import { PaymentMethod } from '../../payment/types/payment-method.enum';

@Injectable()
export class RegistrationRepository {
  constructor(
    @InjectModel(Registration.name)
    private readonly registrationModel: Model<RegistrationDocument>,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    const registration = new this.registrationModel(createRegistrationDto);
    return registration.save();
  }

  async findAll(): Promise<Registration[]> {
    return this.registrationModel.find().exec();
  }

  async findById(id: string): Promise<Registration | null> {
    return this.registrationModel.findById(id).exec();
  }

  async save(registration: RegistrationDocument): Promise<Registration> {
    return registration.save();
  }
} 