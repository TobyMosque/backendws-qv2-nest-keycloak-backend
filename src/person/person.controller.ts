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
import { PersonService } from './person.service';
import { PersonFindRequestDto, PersonQueryRequestDto } from './dto/request.dto';
import { ApiTags, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { Person } from './entities';
import { CreatePersonDto, UpdatePersonDto } from './dto';
import { QueryObjectTrasform } from 'src/pipes/object.transform';
import { Unprotected } from 'nest-keycloak-connect';
import { PersonQueryResponseDto } from './dto/response.dto';

@ApiTags('person')
@Controller('person')
@Unprotected()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get(':id')
  find(
    @Param('id') id: string,
    @Query(QueryObjectTrasform) params: PersonFindRequestDto,
  ): Promise<Person> {
    return this.personService.find(id, params);
  }

  @Get()
  @ApiQuery({ name: 'count', required: false })
  @ApiOkResponse({ type: () => PersonQueryResponseDto })
  query(
    @Query(QueryObjectTrasform) params: PersonQueryRequestDto,
    @Query('count') count?: boolean,
  ): Promise<PersonQueryResponseDto> {
    return this.personService.query(params, count);
  }

  @Put()
  create(@Body() data: CreatePersonDto): Promise<Person> {
    return this.personService.create(data);
  }

  @Put(':id')
  @ApiQuery({ name: 'rev', required: false })
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePersonDto,
    @Query('rev') rev?: string,
  ): Promise<Person> {
    const result = await this.personService.update(id, data, rev);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }

  @Delete(':id')
  @ApiQuery({ name: 'rev', required: false })
  async delete(
    @Param('id') id: string,
    @Query('rev') rev?: string,
  ): Promise<Person> {
    const result = await this.personService.delete(id, rev);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }
}
