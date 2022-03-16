import {
  Body,
  Get,
  Controller,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { PersonService } from './person.service';
import {
  PersonFindRequestDto,
  PersonQueryRequestDto,
  PersonAggregateRequestDto,
} from './dto/request.dto';
import { PersonAggregateResponseDto } from './dto/response.dto';
import { ApiTags } from '@nestjs/swagger';
import { Person } from './entities';
import { CreatePersonDto, UpdatePersonDto } from './dto';

@ApiTags('person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get(':id')
  find(
    @Param('id') id: string,
    @Query() params: PersonFindRequestDto,
  ): Promise<Person> {
    return this.personService.find(id, params);
  }

  @Get()
  query(@Query() params: PersonQueryRequestDto): Promise<Person[]> {
    return this.personService.query(params);
  }

  @Get('aggregate')
  aggregate(
    @Query() params: PersonAggregateRequestDto,
  ): PersonAggregateResponseDto {
    return this.personService.aggregate(params);
  }

  @Put()
  update(@Body() data: CreatePersonDto): Promise<Person> {
    return this.personService.create(data);
  }

  @Put(':id')
  insert(
    @Param('id') id: string,
    @Body() data: UpdatePersonDto,
  ): Promise<Person> {
    return this.personService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Person> {
    return this.personService.delete(id);
  }
}
