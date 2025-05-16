import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationModule } from './modules/registration/registration.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/thpi-get-together'),
    RegistrationModule,
    PaymentModule,
  ],
})
export class AppModule {} 