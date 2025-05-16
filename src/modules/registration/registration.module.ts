import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationController } from './controllers/registration.controller';
import { RegistrationService } from './services/registration.service';
import { RegistrationRepository } from './repositories/registration.repository';
import { Registration, RegistrationSchema } from './entities/registration.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Registration.name, schema: RegistrationSchema },
    ]),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService, RegistrationRepository],
  exports: [RegistrationService],
})
export class RegistrationModule {} 