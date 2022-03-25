import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonQueryRequestDto, PersonFindRequestDto } from './dto/request.dto';
import { Person } from './entities';
import { CreatePersonDto, UpdatePersonDto } from './dto';
import { PersonQueryResponseDto } from './dto/response.dto';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: PersonFindRequestDto): Promise<Person> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.person.findFirst({
      where: {
        personId: id,
      },
      ...params,
    });
  }

  async query(
    params: PersonQueryRequestDto,
    count?: boolean,
  ): Promise<PersonQueryResponseDto> {
    if (params.select && params.include) {
      delete params.include;
    }
    const result: PersonQueryResponseDto = { data: [] };
    result.data = await this.prisma.person.findMany(params);
    if (count) {
      const { cursor, where } = params;
      result.count = await this.prisma.person.count({ cursor, where });
    }
    return result;
  }

  create(data: CreatePersonDto): Promise<Person> {
    return this.prisma.person.create({ data: data as never });
  }

  async update(
    id: string,
    data: UpdatePersonDto,
    rev?: string,
  ): Promise<Person | HttpStatus> {
    const status = await this.checkRev(id, rev);
    if (status !== HttpStatus.OK) {
      return status;
    }
    return this.prisma.person.update({
      where: {
        personId: id,
      },
      data,
    });
  }

  async delete(id: string, rev?: string): Promise<Person | HttpStatus> {
    const status = await this.checkRev(id, rev);
    if (status !== HttpStatus.OK) {
      return status;
    }
    return this.prisma.person.delete({
      where: {
        personId: id,
      },
    });
  }

  async checkRev(id: string, rev?: string): Promise<HttpStatus> {
    if (rev) {
      const { revision } = await this.find(id, {
        select: {
          revision: true,
        },
      });
      if (revision !== rev) {
        return HttpStatus.CONFLICT;
      }
    }
    return HttpStatus.OK;
  }
}
