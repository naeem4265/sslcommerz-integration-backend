import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentTransaction, PaymentTransactionSchema } from './entities/payment-transaction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentTransaction.name, schema: PaymentTransactionSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService],
})
export class PaymentModule {} 