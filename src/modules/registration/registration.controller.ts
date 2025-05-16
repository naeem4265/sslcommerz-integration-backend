import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { Registration } from './entities/registration.entity';

@ApiTags('registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new registration' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Registration created successfully' })
  create(@Body() createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    return this.registrationService.create(createRegistrationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all registrations' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all registrations' })
  findAll(): Promise<Registration[]> {
    return this.registrationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a registration by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the registration' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Registration not found' })
  findOne(@Param('id') id: string): Promise<Registration> {
    return this.registrationService.findOne(id);
  }

  @Post(':id/payment')
  @ApiOperation({ summary: 'Update payment status for a registration' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Payment status updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Registration not found' })
  updatePaymentStatus(
    @Param('id') id: string,
    @Body('paymentMethod') paymentMethod: string,
    @Body('transactionId') transactionId: string,
  ): Promise<Registration> {
    return this.registrationService.updatePaymentStatus(id, paymentMethod, transactionId);
  }
} 