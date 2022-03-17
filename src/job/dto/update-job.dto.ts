import { ApiExtraModels } from '@nestjs/swagger';
import { CreatePersonDto } from '../../person/dto/create-person.dto';
import { ConnectPersonDto } from '../../person/dto/connect-person.dto';

export class UpdateJobPeopleRelationInputDto {
  create?: CreatePersonDto[];
  connect?: ConnectPersonDto[];
}

@ApiExtraModels(
  CreatePersonDto,
  ConnectPersonDto,
  UpdateJobPeopleRelationInputDto,
)
export class UpdateJobDto {
  name?: string;
  people?: UpdateJobPeopleRelationInputDto;
}
