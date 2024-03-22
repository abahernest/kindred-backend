import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../users.service';

@ValidatorConstraint({ async: true })
export class IsUniqueEmailConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UserService) {}

  validate(email: any) {
    return this.usersService
      .findByEmail(email)
      .then((user) => {
        return user == undefined;
      })
      .catch(() => false);
  }

  defaultMessage(): string {
    return 'email already registered';
  }
}

export function IsUniqueEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueEmailConstraint,
    });
  };
}
