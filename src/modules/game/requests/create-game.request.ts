import { IsString, IsUUID } from 'class-validator';

export class CreateGameRequest {
  @IsUUID()
  userId: string;

  @IsString()
  name: string;
}
