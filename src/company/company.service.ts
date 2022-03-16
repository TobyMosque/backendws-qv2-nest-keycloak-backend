import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CompanyQueryRequestDto,
  CompanyAggregateRequestDto,
  CompanyFindRequestDto,
} from './dto/request.dto';
import { CompanyAggregateResponseDto } from './dto/response.dto';
import { Company } from './entities';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: CompanyFindRequestDto): Promise<Company> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.company.findUnique({
      where: {
        companyId: id,
      },
      ...params,
    });
  }

  query(params: CompanyQueryRequestDto): Promise<Company[]> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.company.findMany(params);
  }

  aggregate(params: CompanyAggregateRequestDto): CompanyAggregateResponseDto {
    return this.prisma.company.aggregate(params);
  }

  create(data: CreateCompanyDto): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  update(id: string, data: UpdateCompanyDto): Promise<Company> {
    return this.prisma.company.update({
      where: {
        companyId: id,
      },
      data,
    });
  }

  delete(id: string): Promise<Company> {
    return this.prisma.company.delete({
      where: {
        companyId: id,
      },
    });
  }
}
