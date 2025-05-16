import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { PaymentRepository } from './repositories/payment.repository';
import { SSLCommerzService } from './services/sslcommerz.service';
import { RegistrationModule } from '../registration/registration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentTransaction]),
    RegistrationModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository, SSLCommerzService],
})
export class PaymentModule {} 