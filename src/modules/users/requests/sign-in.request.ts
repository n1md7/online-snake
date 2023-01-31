import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignInRequest {
  @IsUUID()
  key: string;
}
