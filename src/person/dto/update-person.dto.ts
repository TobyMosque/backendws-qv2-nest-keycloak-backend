import { ApiExtraModels } from '@nestjs/swagger';
import { CreateJobDto } from '../../job/dto/create-job.dto';
import { ConnectJobDto } from '../../job/dto/connect-job.dto';
import { CreateCompanyDto } from '../../company/dto/create-company.dto';
import { ConnectCompanyDto } from '../../company/dto/connect-company.dto';

export class UpdatePersonJobRelationInputDto {
  create?: CreateJobDto;
  connect?: ConnectJobDto;
}
export class UpdatePersonCompanyRelationInputDto {
  create?: CreateCompanyDto;
  connect?: ConnectCompanyDto;
}

@ApiExtraModels(
  CreateJobDto,
  ConnectJobDto,
  UpdatePersonJobRelationInputDto,
  CreateCompanyDto,
  ConnectCompanyDto,
  UpdatePersonCompanyRelationInputDto,
)
export class UpdatePersonDto {
  avatar?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  job?: UpdatePersonJobRelationInputDto;
  company?: UpdatePersonCompanyRelationInputDto;
}
