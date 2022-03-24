import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma, Job, Company, Person } from '@prisma/client';
import { CreateJobDto } from 'src/job/dto';
import { CreateCompanyDto } from 'src/company/dto';
import { CreatePersonDto } from 'src/person/dto';
import { v4 as uid } from 'uuid';

type Entity = Partial<{
  isDeleted: boolean | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
  revision: string;
}>;

function comb({ date }: { date?: Date } = {}) {
  if (!date) {
    date = new Date();
  }
  const uuid = uid();
  let comb = ('00000000000' + date.getTime().toString(16)).substr(-12);
  comb = comb.slice(0, 8) + '-' + comb.slice(8, 12);
  return uuid.replace(uuid.slice(0, 13), comb);
}

class EntityMiddlewareOptions<TCreate extends Partial<Entity>> {
  name: Prisma.ModelName;
  props?: Partial<
    Record<keyof Omit<TCreate, keyof Entity>, EntityMiddlewareOptions<unknown>>
  > = {};
}

function EntityMiddlewareFactory<T extends Partial<Entity>>({
  name,
  props,
}: EntityMiddlewareOptions<T>): Prisma.Middleware {
  return function entityMiddleware(params, next) {
    if (params.model !== name) {
      return next(params);
    }
    type TEntity = Required<T>;

    function extendQuery({
      args,
      props,
    }: {
      args: { select?: TEntity; where?: TEntity };
      props: Partial<Record<string, EntityMiddlewareOptions<unknown>>>;
    }) {
      if (!args.where) {
        args.where = {} as TEntity;
      }

      switch (args.where.isDeleted) {
        case undefined:
          args.where.isDeleted = false;
          break;
        case 'all':
          args.where.isDeleted = undefined;
          break;
      }
      if (args.select) {
        for (const key in props) {
          if (key in args.select) {
            if (typeof args.select[key] === 'boolean') {
              args.select[key] = {};
            }
            extendQuery({
              args: args.select[key],
              props: props[key].props,
            });
          }
        }
      }
    }
    function setCreated(key: 'data' | 'create' = 'data') {
      const args: { [key: string]: TEntity } = params.args || {};
      if (!args[key]) {
        args[key] = {} as TEntity;
      }
      args[key].createdAt = args[key].updatedAt = new Date();
      args[key].revision = comb();
    }
    function setUpdated(key: 'data' | 'update' = 'data') {
      const args: { [key: string]: TEntity } = params.args || {};
      if (!args[key]) {
        args[key] = {} as TEntity;
      }
      args[key].updatedAt = new Date();
      args[key].revision = comb();
    }
    function queryFilter() {
      extendQuery({
        args: params.args || {},
        props,
      });
    }
    function onCreated() {
      setCreated();
    }
    function onUpdated() {
      setUpdated();
    }
    function onUpserted() {
      setCreated('create');
      setUpdated('update');
    }
    function onDeleted() {
      switch (params.action) {
        case 'delete':
          params.action = 'update';
          break;
        case 'deleteMany':
          params.action = 'updateMany';
          break;
      }
      const args: { data: TEntity } = params.args || {};
      if (!args.data) {
        args.data = {} as TEntity;
      }
      args.data.isDeleted = true;
      args.data.deletedAt = new Date();
      // args.data.revision = comb();
      console.log(params.args, args.data);
    }
    switch (params.action) {
      case 'findFirst':
      case 'findMany':
        queryFilter();
        break;
      case 'create':
      case 'createMany':
        onCreated();
        break;
      case 'update':
      case 'updateMany':
        onUpdated();
        break;
      case 'upsert':
        onUpserted();
        break;
      case 'delete':
      case 'deleteMany':
        onDeleted();
        break;
    }
    console.log(params);
    return next(params);
  };
}

const jobOptions: EntityMiddlewareOptions<Prisma.JobCreateInput> = {
  name: Prisma.ModelName.Job,
  props: {},
};

const companyOptions: EntityMiddlewareOptions<Prisma.CompanyCreateInput> = {
  name: Prisma.ModelName.Company,
  props: {},
};

const personOptions: EntityMiddlewareOptions<Prisma.PersonCreateInput> = {
  name: Prisma.ModelName.Person,
  props: {},
};

jobOptions.props.people = personOptions;
companyOptions.props.people = personOptions;
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    this.$use(EntityMiddlewareFactory<Job>(jobOptions));
    this.$use(EntityMiddlewareFactory<Company>(companyOptions));
    this.$use(EntityMiddlewareFactory<Person>(personOptions));
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
