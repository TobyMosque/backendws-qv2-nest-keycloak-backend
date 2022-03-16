import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PersonQueryRequestDto,
  PersonAggregateRequestDto,
  PersonFindRequestDto,
} from './dto/request.dto';
import { PersonAggregateResponseDto } from './dto/response.dto';
import { Person } from './entities';
import { CreatePersonDto, UpdatePersonDto } from './dto';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: PersonFindRequestDto): Promise<Person> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.person.findUnique({
      where: {
        personId: id,
      },
      ...params,
    });
  }

  query(params: PersonQueryRequestDto): Promise<Person[]> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.person.findMany(params);
  }

  aggregate(params: PersonAggregateRequestDto): PersonAggregateResponseDto {
    return this.prisma.person.aggregate(params);
  }

  create(data: CreatePersonDto): Promise<Person> {
    return this.prisma.person.create({ data: data as never });
  }

  update(id: string, data: UpdatePersonDto): Promise<Person> {
    return this.prisma.person.update({
      where: {
        personId: id,
      },
      data,
    });
  }

  delete(id: string): Promise<Person> {
    return this.prisma.person.delete({
      where: {
        personId: id,
      },
    });
  }
}
