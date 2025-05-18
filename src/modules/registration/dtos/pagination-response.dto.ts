import { ApiProperty } from '@nestjs/swagger';
import { RegistrationResponseDto } from './registration-response.dto';

export class PaginationMetadataDto {
  @ApiProperty({ description: 'Total number of items across all pages' })
  total: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a previous page' })
  hasPreviousPage: boolean;

  @ApiProperty({ description: 'Whether there is a next page' })
  hasNextPage: boolean;
}

export class PaginationResponseDto<T = any> {
  @ApiProperty({ description: 'Array of registration items' })
  data: T[];

  @ApiProperty({ description: 'Pagination metadata' })
  pagination: PaginationMetadataDto;
} 