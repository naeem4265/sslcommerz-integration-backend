import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RegistrationService } from '../services/registration.service';
import { CreateRegistrationDto } from '../dtos/create-registration.dto';
import { RegistrationResponseDto } from '../dtos/registration-response.dto';
import { Registration, RegistrationDocument } from '../entities/registration.entity';
import { PaymentMethod } from '../../payment/types/payment-method.enum';
import { Types } from 'mongoose';

@ApiTags('registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new registration',
    description: 'Creates a new registration for the ThPI Alumni Get Together event'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Registration created successfully',
    type: RegistrationResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  async create(@Body() createRegistrationDto: CreateRegistrationDto): Promise<RegistrationResponseDto> {
    const registration = await this.registrationService.create(createRegistrationDto);
    return this.toResponseDto(registration);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all registrations',
    description: 'Retrieves all registrations for the ThPI Alumni Get Together event'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all registrations',
    type: [RegistrationResponseDto]
  })
  async findAll(): Promise<RegistrationResponseDto[]> {
    const registrations = await this.registrationService.findAll();
    return registrations.map(reg => this.toResponseDto(reg));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a registration by id',
    description: 'Retrieves a specific registration by its ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the registration',
    type: RegistrationResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Registration not found'
  })
  async findOne(@Param('id') id: string): Promise<RegistrationResponseDto> {
    const registration = await this.registrationService.findOne(id);
    return this.toResponseDto(registration);
  }

  @Post(':id/payment')
  @ApiOperation({
    summary: 'Update payment status',
    description: 'Updates the payment status for a specific registration'
  })
  @ApiParam({
    name: 'id',
    description: 'Registration ID',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment status updated successfully',
    type: RegistrationResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Registration not found'
  })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('paymentMethod') paymentMethod: PaymentMethod,
    @Body('transactionId') transactionId: string,
  ): Promise<RegistrationResponseDto> {
    const registration = await this.registrationService.updatePaymentStatus(
      id,
      paymentMethod,
      transactionId,
    );
    return this.toResponseDto(registration);
  }

  private toResponseDto(registration: Registration): RegistrationResponseDto {
    const response = new RegistrationResponseDto();
    const doc = (registration as RegistrationDocument).toObject();
    Object.assign(response, {
      id: doc._id.toString(),
      ...doc,
      _id: undefined,
      __v: undefined,
    });
    return response;
  }
} 