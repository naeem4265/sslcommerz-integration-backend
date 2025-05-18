import { IsString, IsEmail, IsOptional, IsNotEmpty, Matches, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty({
    description: 'Full name of the participant',
    example: 'John Doe',
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  fullName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+8801712345678', 
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Batch/Year of study',
    example: '2018',
  })
  @IsString()
  @IsNotEmpty()
  batch: string;

  @ApiProperty({
    description: 'Department name',
    example: 'Computer Science',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  department: string;

  @ApiPropertyOptional({
    description: 'Current organization',
    example: 'Tech Solutions Ltd.',
    maxLength: 100
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  currentOrganization?: string;

  @ApiPropertyOptional({
    description: 'Current designation',
    example: 'Senior Software Engineer',
    maxLength: 50
  })
  @IsString()
  @IsOptional()
  @Length(0, 50)
  designation?: string;

  @ApiProperty({
    description: 'Current address',
    example: 'House #123, Road #45, Sector #10, Uttara, Dhaka',
    minLength: 10,
    maxLength: 200
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  address: string;
} 