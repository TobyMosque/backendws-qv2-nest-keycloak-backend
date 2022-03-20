import {
  Body,
  Get,
  Controller,
  Param,
  Query,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  CompanyQueryRequestDto,
  CompanyFindRequestDto,
} from './dto/request.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Company } from './entities';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { Unprotected } from 'nest-keycloak-connect';
import { QueryObjectTrasform } from 'src/pipes/object.transform';

@ApiTags('company')
@Controller('company')
@Unprotected()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get(':id')
  find(
    @Param('id') id: string,
    @Query(QueryObjectTrasform) params: CompanyFindRequestDto,
  ): Promise<Company> {
    return this.companyService.find(id, params);
  }

  @Get()
  @ApiQuery({ name: 'count', required: false })
  query(
    @Query(QueryObjectTrasform) params: CompanyQueryRequestDto,
    @Query('count') count?: boolean,
  ): Promise<{ data: Company[]; count?: number }> {
    return this.companyService.query(params, count);
  }

  @Put()
  create(@Body() data: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(data);
  }

  @Put(':id')
  @ApiQuery({ name: 'rev', required: false })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCompanyDto,
    @Query('rev') rev?: string,
  ): Promise<Company> {
    const result = await this.companyService.update(id, data, rev);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }

  @Delete(':id')
  @ApiQuery({ name: 'rev', required: false })
  async delete(@Param('id') id: string, @Query('rev') rev?: string) {
    const result = await this.companyService.delete(id, rev);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }
}
