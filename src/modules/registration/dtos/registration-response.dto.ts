import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrationResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '01712345678' })
  phone: string;

  @ApiProperty({ example: '2018' })
  batch: string;

  @ApiProperty({ example: 'Computer Science' })
  department: string;

  @ApiPropertyOptional({ example: 'Tech Solutions Ltd.' })
  currentOrganization?: string;

  @ApiPropertyOptional({ example: 'Senior Software Engineer' })
  designation?: string;

  @ApiProperty({ example: 'House #123, Road #45, Sector #10, Uttara, Dhaka' })
  address: string;

  @ApiProperty({ example: false })
  paymentCompleted: boolean;

  @ApiPropertyOptional({ example: 'BKASH' })
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'TXN-123456789' })
  paymentTransactionId?: string;

  @ApiProperty({ example: 'PENDING', enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  status: string;

  @ApiProperty({ example: '2024-02-28T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-28T12:00:00.000Z' })
  updatedAt: Date;
} 