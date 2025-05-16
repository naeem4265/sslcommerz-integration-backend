import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentMethod } from '../../payment/types/payment-method.enum';

@Schema({ timestamps: true })
export class Registration {
  _id: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  batch: string;

  @Prop({ required: true })
  department: string;

  @Prop()
  currentOrganization?: string;

  @Prop()
  designation?: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: false })
  paymentCompleted: boolean;

  @Prop({ type: String, enum: PaymentMethod })
  paymentMethod?: PaymentMethod;

  @Prop()
  paymentTransactionId?: string;

  @Prop()
  paymentAmount?: number;

  @Prop()
  paymentInitiatedAt?: Date;

  @Prop()
  paymentCompletedAt?: Date;

  @Prop({ default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  createdAt: Date;
  updatedAt: Date;
}

export type RegistrationDocument = Registration & Document;
export const RegistrationSchema = SchemaFactory.createForClass(Registration); 