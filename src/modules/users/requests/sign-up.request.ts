import { IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpRequest {
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  username: string;
}
