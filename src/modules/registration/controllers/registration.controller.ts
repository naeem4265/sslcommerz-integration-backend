import { Controller, Get, Post, Body, Param, HttpStatus, Logger, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RegistrationService } from '../services/registration.service';
import { CreateRegistrationDto } from '../dtos/create-registration.dto';
import { RegistrationResponseDto } from '../dtos/registration-response.dto';
import { Registration } from '../entities/registration.entity';
import { PaymentMethod } from '../../payment/types/payment-method.enum';
import { JwtAuthGuard } from '../../admin/guards/jwt-auth.guard';
import { PaginationDto } from '../dtos/pagination.dto';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';

@ApiTags('registration')
@Controller('registration')
export class RegistrationController {
  private readonly logger = new Logger(RegistrationController.name);

  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new registration',
    description: 'Creates a new registration for the Alumni Get Together event'
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
    this.logger.log(`Creating registration for ${createRegistrationDto.fullName}`);
    const registration = await this.registrationService.create(createRegistrationDto);
    return this.toResponseDto(registration);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all registrations with pagination',
    description: 'Retrieves paginated registrations for the Alumni Get Together event (Admin only)'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (starting from 1)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page (max 100)', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Search term to filter registrations by email', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated registrations',
    type: PaginationResponseDto
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required'
  })
  async findAll(@Query() paginationDto: PaginationDto): Promise<PaginationResponseDto<RegistrationResponseDto>> {
    this.logger.log(`Fetching registrations page ${paginationDto.page}, limit ${paginationDto.limit}`);
    const paginatedResult = await this.registrationService.findAll(paginationDto);
    
    return {
      data: paginatedResult.data.map(reg => this.toResponseDto(reg)),
      pagination: paginatedResult.pagination
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get a registration by id',
    description: 'Retrieves a specific registration by its ID (Admin only)'
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required'
  })
  async findOne(@Param('id') id: string): Promise<RegistrationResponseDto> {
    this.logger.log(`Fetching registration with ID: ${id}`);
    const registration = await this.registrationService.findOne(id);
    return this.toResponseDto(registration);
  }

  @Post(':id/payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update payment status',
    description: 'Updates the payment status for a specific registration (Admin only)'
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required'
  })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body('paymentMethod') paymentMethod: PaymentMethod,
    @Body('transactionId') transactionId: string,
  ): Promise<RegistrationResponseDto> {
    this.logger.log(`Updating payment status for registration ID: ${id}`);
    const registration = await this.registrationService.updatePaymentStatus(
      id,
      paymentMethod,
      transactionId,
    );
    return this.toResponseDto(registration);
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