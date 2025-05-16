import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty({ description: 'Full name of the participant' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Batch/Year of study' })
  @IsString()
  @IsNotEmpty()
  batch: string;

  @ApiProperty({ description: 'Department name' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiPropertyOptional({ description: 'Current organization' })
  @IsString()
  @IsOptional()
  currentOrganization?: string;

  @ApiPropertyOptional({ description: 'Current designation' })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiProperty({ description: 'Current address' })
  @IsString()
  @IsNotEmpty()
  address: string;
} 