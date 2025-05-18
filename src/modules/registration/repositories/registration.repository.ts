import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from '../entities/registration.entity';
import { CreateRegistrationDto } from '../dtos/create-registration.dto';
import { PaginationDto } from '../dtos/pagination.dto';

@Injectable()
export class RegistrationRepository {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    const registration = this.registrationRepository.create(createRegistrationDto);
    return this.registrationRepository.save(registration);
  }

  async findAll(paginationDto: PaginationDto): Promise<[Registration[], number]> {
    const { skip, limit, search } = paginationDto;
    
    const queryBuilder = this.registrationRepository.createQueryBuilder('registration');
    
    if (search) {
      queryBuilder.where(
        '(registration.email ILIKE :search OR ' +
        'registration.fullName ILIKE :search OR ' +
        'registration.phone ILIKE :search)', 
        { search: `%${search}%` }
      );
    }
    
    queryBuilder
      .orderBy('registration.createdAt', 'DESC')
      .skip(skip)
      .take(limit);
    
    return queryBuilder.getManyAndCount();
  }

  async findById(id: string): Promise<Registration | null> {
    return this.registrationRepository.findOne({ where: { id } });
  }

  async save(registration: Registration): Promise<Registration> {
    return this.registrationRepository.save(registration);
  }
} 