import { IsString, IsNumber, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../types/payment-method.enum';

export class InitiatePaymentDto {
  @ApiProperty({
    description: 'Registration ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsString()
  @IsNotEmpty()
  registrationId: string;

  @ApiProperty({
    description: 'Payment amount in BDT',
    example: 1000,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethod,
    example: PaymentMethod.BKASH
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
} 