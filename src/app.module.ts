import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';

@Module({
  imports: [
    AuthModule,
    KeycloakConnectModule.register({
      authServerUrl: 'https://oidc.tobiasmesquita.dev/auth',
      realm: 'quasar-rxdb-realm',
      clientId: 'nestjs-be-app',
      secret: 'WoaF2NKXalmJOsqBL9c1ssB5epSzlHMs',
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
