import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { Job } from 'src/job/entities';
import { Company } from 'src/company/entities';
import { Person } from 'src/person/entities';

const { ModelName } = Prisma;
const sdModels = [ModelName.Person, ModelName.Company, ModelName.Job];

type Entity = Job | Company | Person;

const SoftDelete: Prisma.Middleware = (params, next) => {
  // Check incoming query type
  function softDelete(from: Prisma.PrismaAction, to: Prisma.PrismaAction) {
    let data = params.args.data as Partial<Entity>;
    if (params.action == from) {
      // Delete queries
      // Change action to an update
      params.action = to;
      if (data != undefined) {
        data.isDeleted = true;
      } else {
        data = { isDeleted: true };
      }
    }
  }
  if (sdModels.includes(params.model)) {
    softDelete('delete', 'update');
    softDelete('deleteMany', 'updateMany');
  }
  return next(params);
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    this.person.findMany({
      select: {
        company: { select: { name: true } },
        job: { select: { name: true } },
      },
    });
    this.$use(SoftDelete);
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
