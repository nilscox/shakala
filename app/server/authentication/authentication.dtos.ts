import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { FormValues } from '../types/form-values';

export class SignupDto {
  constructor(data: FormValues<SignupDto>) {
    Object.assign(this, data);
  }

  @IsString()
  @IsEmail()
  @MaxLength(100)
  email!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  nick!: string;
}

export class LoginDto {
  constructor(data: FormValues<LoginDto>) {
    Object.assign(this, data);
  }

  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
