import { Controller, Get, Post, Body, Param, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RegistrationService } from '../services/registration.service';
import { CreateRegistrationDto } from '../dtos/create-registration.dto';
import { RegistrationResponseDto } from '../dtos/registration-response.dto';
import { Registration } from '../entities/registration.entity';
import { PaymentMethod } from '../../payment/types/payment-method.enum';

@ApiTags('registration')
@Controller('registration')
export class RegistrationController {
  private readonly logger = new Logger(RegistrationController.name);

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
    try {
      this.logger.log(`Creating new registration for ${createRegistrationDto.fullName}`);
      const registration = await this.registrationService.create(createRegistrationDto);
      this.logger.debug(`Registration created with ID: ${registration.id}`);
      return this.toResponseDto(registration);
    } catch (error) {
      this.logger.error(`Failed to create registration: ${error.message}`);
      throw error;
    }
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
    try {
      this.logger.log('Fetching all registrations');
      const registrations = await this.registrationService.findAll();
      this.logger.debug(`Found ${registrations.length} registrations`);
      return registrations.map(reg => this.toResponseDto(reg));
    } catch (error) {
      this.logger.error(`Failed to fetch registrations: ${error.message}`);
      throw error;
    }
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
    try {
      this.logger.log(`Fetching registration with ID: ${id}`);
      const registration = await this.registrationService.findOne(id);
      return this.toResponseDto(registration);
    } catch (error) {
      this.logger.error(`Failed to fetch registration: ${error.message}`);
      throw error;
    }
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
    try {
      this.logger.log(`Updating payment status for registration ID: ${id}`);
      this.logger.debug(`Payment method: ${paymentMethod}, Transaction ID: ${transactionId}`);
      const registration = await this.registrationService.updatePaymentStatus(
        id,
        paymentMethod,
        transactionId,
      );
      this.logger.log(`Payment status updated successfully for registration ID: ${id}`);
      return this.toResponseDto(registration);
    } catch (error) {
      this.logger.error(`Failed to update payment status: ${error.message}`);
      throw error;
    }
  }

  private toResponseDto(registration: Registration): RegistrationResponseDto {
    const response = new RegistrationResponseDto();
    Object.assign(response, {
      ...registration,
      id: registration.id,
    });
    return response;
  }
} 