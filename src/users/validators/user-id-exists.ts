import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../users.service';

@ValidatorConstraint({ async: true })
export class UserIdExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UserService) {}

  validate(userId: number) {
    return this.usersService
      .findById(userId)
      .then((user) => {
        return user != undefined;
      })
      .catch(() => false);
  }

  defaultMessage(): string {
    return 'user id does not exist';
  }
}

export function UserIdExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UserIdExistsConstraint,
    });
  };
}
