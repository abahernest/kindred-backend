import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const [, username, password, host, database, dbUrl] = [
          configService.get<string>('NODE_ENV'),
          configService.get<string>('DATABASE_USER'),
          configService.get<string>('DATABASE_PASSWORD'),
          configService.get<string>('DATABASE_HOST'),
          configService.get<string>('DATABASE_NAME'),
          configService.get<string>('DATABASE_URL'),
        ];

        return {
          type: 'postgres',
          url:
            dbUrl ||
            `postgres://${username}:${password}@${host}:5432/${database}`,
          retryAttempts: 2,
          useUTC: true,
          entities: [UserEntity],
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
