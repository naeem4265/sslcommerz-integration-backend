import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Registration, RegistrationDocument } from './entities/registration.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(Registration.name)
    private registrationModel: Model<RegistrationDocument>,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    const registration = new this.registrationModel(createRegistrationDto);
    return registration.save();
  }

  async findAll(): Promise<Registration[]> {
    return this.registrationModel.find().exec();
  }

  async findOne(id: string): Promise<Registration> {
    const registration = await this.registrationModel.findById(id).exec();
    if (!registration) {
      throw new NotFoundException(`Registration #${id} not found`);
    }
    return registration;
  }

  async updatePaymentStatus(
    id: string,
    paymentMethod: string,
    transactionId: string,
  ): Promise<Registration> {
    const registration = await this.registrationModel.findById(id).exec();
    if (!registration) {
      throw new NotFoundException(`Registration #${id} not found`);
    }

    registration.paymentCompleted = true;
    registration.paymentMethod = paymentMethod;
    registration.paymentTransactionId = transactionId;
    registration.status = 'APPROVED';

    return registration.save();
  }
} 