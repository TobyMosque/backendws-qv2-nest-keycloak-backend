import {
  Body,
  Get,
  Controller,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  CompanyFindRequestDto,
  CompanyQueryRequestDto,
  CompanyAggregateRequestDto,
} from './dto/request.dto';
import { CompanyAggregateResponseDto } from './dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { Company } from './entities';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get(':id')
  find(
    @Param('id') id: string,
    @Query() params: CompanyFindRequestDto,
  ): Promise<Company> {
    return this.companyService.find(id, params);
  }

  @Get()
  query(@Query() params: CompanyQueryRequestDto): Promise<Company[]> {
    return this.companyService.query(params);
  }

  @Get('aggregate')
  aggregate(
    @Query() params: CompanyAggregateRequestDto,
  ): CompanyAggregateResponseDto {
    return this.companyService.aggregate(params);
  }

  @Put()
  update(@Body() data: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(data);
  }

  @Put(':id')
  insert(
    @Param('id') id: string,
    @Body() data: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Company> {
    return this.companyService.delete(id);
  }
}
