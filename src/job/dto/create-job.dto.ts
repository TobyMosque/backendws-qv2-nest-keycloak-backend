import { ApiExtraModels } from '@nestjs/swagger';
import { CreatePersonDto } from '../../person/dto/create-person.dto';
import { ConnectPersonDto } from '../../person/dto/connect-person.dto';

export class CreateJobPeopleRelationInputDto {
  create?: CreatePersonDto[];
  connect?: ConnectPersonDto[];
}

@ApiExtraModels(
  CreatePersonDto,
  ConnectPersonDto,
  CreateJobPeopleRelationInputDto,
)
export class CreateJobDto {
  name: string;
  people?: CreateJobPeopleRelationInputDto;
}
