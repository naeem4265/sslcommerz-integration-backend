import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Transaction ID from the payment gateway',
    example: 'TXN-123456789'
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'Payment status from the payment gateway',
    example: 'VALID'
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Validation ID from the payment gateway',
    example: 'VAL-123456789'
  })
  @IsString()
  @IsNotEmpty()
  validationId: string;
} 