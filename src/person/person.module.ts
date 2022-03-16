import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [PersonController],
  providers: [PrismaService, PersonService],
})
export class PersonModule {}
