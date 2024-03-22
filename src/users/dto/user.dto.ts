import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserIdExists } from '../validators/user-id-exists';
import { IsUniqueEmail } from '../validators/is-unique-email';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsUniqueEmail()
  email: string;

  @IsString()
  @IsStrongPassword(
    {
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minLength: 8,
    },
    {
      message:
        'password must have at least 8 characters, 1 Lowercase, 1 Uppercase, and 1 Symbol',
    },
  )
  password: string;
}

export class UpdateUserFilterDto {
  _id?: number;
  email?: string;
}

export class UserIdDto {
  @IsString()
  @UserIdExists()
  user_id: string;
}
