import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentMethod } from '../types/payment-method.enum';

export type PaymentTransactionDocument = PaymentTransaction & Document;

@Schema({ timestamps: true })
export class PaymentTransaction extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Registration' })
  registrationId: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true, type: String, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'PENDING' })
  status: 'PENDING' | 'COMPLETED' | 'FAILED';

  @Prop()
  paymentUrl?: string;

  @Prop()
  gatewayResponse?: string;

  @Prop()
  completedAt?: Date;

  @Prop()
  failedAt?: Date;

  @Prop()
  failureReason?: string;

  // Add timestamps from Schema options
  createdAt: Date;
  updatedAt: Date;
}

export const PaymentTransactionSchema = SchemaFactory.createForClass(PaymentTransaction); 