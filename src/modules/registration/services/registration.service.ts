import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { CreateRegistrationDto } from '../dtos/create-registration.dto';
import { RegistrationRepository } from '../repositories/registration.repository';
import { Registration } from '../entities/registration.entity';
import { PaymentMethod } from '../../payment/types/payment-method.enum';
import { PaginationDto } from '../dtos/pagination.dto';
import { PaginationResponseDto } from '../dtos/pagination-response.dto';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(private readonly registrationRepository: RegistrationRepository) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    try {
      this.logger.log(`Creating new registration for ${createRegistrationDto.fullName}`);
      const registration = await this.registrationRepository.create(createRegistrationDto);
      this.logger.debug(`Registration created with ID: ${registration.id}`);
      return registration;
    } catch (error) {
      this.logger.error(`Failed to create registration: ${error.message}`);
      throw new InternalServerErrorException(
        error.message || 'Failed to create registration'
      );
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginationResponseDto<Registration>> {
    try {
      this.logger.log('Fetching registrations with pagination');
      const [items, total] = await this.registrationRepository.findAll(paginationDto);
      
      const totalPages = Math.ceil(total / paginationDto.limit);
      
      this.logger.debug(`Found ${items.length} registrations (page ${paginationDto.page} of ${totalPages})`);
      
      return {
        data: items,
        pagination: {
          total,
          page: paginationDto.page,
          limit: paginationDto.limit,
          totalPages,
          hasPreviousPage: paginationDto.page > 1,
          hasNextPage: paginationDto.page < totalPages
        }
      };
    } catch (error) {
      this.logger.error(`Failed to fetch registrations: ${error.message}`);
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch registrations'
      );
    }
  }

  async findOne(id: string): Promise<Registration> {
    this.logger.log(`Fetching registration with ID: ${id}`);
    try {
      const registration = await this.registrationRepository.findById(id);
      if (!registration) {
        this.logger.warn(`Registration #${id} not found`);
        throw new NotFoundException(`Registration #${id} not found`);
      }
      return registration;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch registration: ${error.message}`);
      throw new InternalServerErrorException(
        error.message || `Failed to fetch registration #${id}`
      );
    }
  }

  async updatePaymentStatus(
    id: string,
    paymentMethod: PaymentMethod,
    transactionId: string,
  ): Promise<Registration> {
    try {
      this.logger.log(`Updating payment status for registration ID: ${id}`);
      this.logger.debug(`Payment method: ${paymentMethod}, Transaction ID: ${transactionId}`);
      
      const registration = await this.findOne(id);
      
      const updatedRegistration = await this.registrationRepository.save(
        Object.assign(registration, {
          paymentMethod,
          paymentTransactionId: transactionId,
          paymentCompleted: true,
          paymentCompletedAt: new Date(),
          status: 'APPROVED' as const
        })
      );

      this.logger.log(`Payment status updated successfully for registration ID: ${id}`);
      return updatedRegistration;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update payment status: ${error.message}`);
      throw new InternalServerErrorException(
        error.message || `Failed to update payment status for registration #${id}`
      );
    }
  }
} 