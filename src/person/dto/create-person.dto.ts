import { ApiExtraModels } from '@nestjs/swagger';
import { CreateJobDto } from '../../job/dto/create-job.dto';
import { ConnectJobDto } from '../../job/dto/connect-job.dto';
import { CreateCompanyDto } from '../../company/dto/create-company.dto';
import { ConnectCompanyDto } from '../../company/dto/connect-company.dto';

export class CreatePersonJobRelationInputDto {
  create?: CreateJobDto;
  connect?: ConnectJobDto;
}
export class CreatePersonCompanyRelationInputDto {
  create?: CreateCompanyDto;
  connect?: ConnectCompanyDto;
}

@ApiExtraModels(
  CreateJobDto,
  ConnectJobDto,
  CreatePersonJobRelationInputDto,
  CreateCompanyDto,
  ConnectCompanyDto,
  CreatePersonCompanyRelationInputDto,
)
export class CreatePersonDto {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  job: CreatePersonJobRelationInputDto;
  company: CreatePersonCompanyRelationInputDto;
}
