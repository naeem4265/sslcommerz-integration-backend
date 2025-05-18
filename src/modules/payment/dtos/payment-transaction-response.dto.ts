import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentTransactionResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  registrationId: string;

  @ApiProperty({ example: 'TXN-123456789' })
  transactionId: string;

  @ApiProperty({
    example: 1000,
    description: 'Payment amount in BDT'
  })
  amount: number;

  @ApiPropertyOptional({
    example: 'https://sslcommerz.com/pay/TXN-123456789',
    description: 'URL for completing the payment'
  })
  paymentUrl?: string;

  @ApiPropertyOptional({
    example: 'Payment processed successfully',
    description: 'Response from payment gateway'
  })
  gatewayResponse?: string;

  @ApiPropertyOptional({
    example: '2024-02-28T12:00:00.000Z',
    description: 'When the payment was completed'
  })
  completedAt?: Date;

  @ApiProperty({
    example: '2024-02-28T12:00:00.000Z',
    description: 'When the transaction was created'
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-02-28T12:00:00.000Z',
    description: 'When the transaction was last updated'
  })
  updatedAt: Date;
} 