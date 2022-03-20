import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma, Job, Company, Person } from '@prisma/client';
import { v4 as uid } from 'uuid';

type Entity = Partial<{
  isDeleted: boolean | string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
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

function EntityMiddlewareFactory<T extends Entity>(
  name: Prisma.ModelName,
): Prisma.Middleware {
  return (params, next) => {
    if (params.model !== name) {
      return next(params);
    }
    function queryFilter() {
      const actions: Prisma.PrismaAction[] = ['findFirst', 'findMany'];
      if (!actions.includes(params.action)) {
        return next(params);
      }

      const args: { where?: T } = params.args || {};
      if (!args.where) {
        args.where = {} as T;
      }
      switch (args.where.isDeleted) {
        case undefined:
          args.where.isDeleted = false;
          break;
        case 'all':
          args.where.isDeleted = undefined;
          break;
      }
      return next(params);
    }
    function onDeleted() {
      const actions: Prisma.PrismaAction[] = ['delete', 'deleteMany'];
      if (!actions.includes(params.action)) {
        return;
      }
      switch (params.action) {
        case 'delete':
          params.action = 'update';
          break;
        case 'deleteMany':
          params.action = 'updateMany';
          break;
      }
      const args: { data: T } = params.args || {};
      if (!args.data) {
        args.data = {} as T;
      }
      args.data.isDeleted = true;
      args.data.deletedAt = new Date();
      args.data.revision = comb();
    }
    function setCreated(key: 'data' | 'create' = 'data') {
      const args: { [key: string]: T } = params.args || {};
      if (!args[key]) {
        args[key] = {} as T;
      }
      args[key].createdAt = args[key].updatedAt = new Date();
      args[key].revision = comb();
    }
    function setUpdated(key: 'data' | 'update' = 'data') {
      const args: { [key: string]: T } = params.args || {};
      if (!args[key]) {
        args[key] = {} as T;
      }
      args[key].updatedAt = new Date();
      args[key].revision = comb();
    }
    function onCreated() {
      const actions: Prisma.PrismaAction[] = ['create', 'createMany'];
      if (!actions.includes(params.action)) {
        return;
      }
      setCreated();
    }
    function onUpdated() {
      const actions: Prisma.PrismaAction[] = ['update', 'updateMany'];
      if (!actions.includes(params.action)) {
        return;
      }
      setUpdated();
    }
    function onUpserted() {
      const actions: Prisma.PrismaAction[] = ['upsert'];
      if (!actions.includes(params.action)) {
        return;
      }
      setCreated('create');
      setUpdated('update');
    }
    queryFilter();
    onCreated();
    onUpdated();
    onUpserted();
    onDeleted();
    return next(params);
  };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    this.$use(EntityMiddlewareFactory<Job>(Prisma.ModelName.Job));
    this.$use(EntityMiddlewareFactory<Company>(Prisma.ModelName.Company));
    this.$use(EntityMiddlewareFactory<Person>(Prisma.ModelName.Person));
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
