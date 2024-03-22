import { Global, Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { UserIdExistsConstraint } from './validators/user-id-exists';
import { IsUniqueEmailConstraint } from './validators/is-unique-email';
import { PasswordUtilService } from '../utils/password.util.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UserService,
    PasswordUtilService,
    IsUniqueEmailConstraint,
    UserIdExistsConstraint,
  ],
  exports: [UserService, UserIdExistsConstraint],
})
export class UsersModule {}
