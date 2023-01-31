import { IsUUID } from 'class-validator';

export class JoinGameRequest {
  @IsUUID()
  userId: string;

  @IsUUID()
  gameId: string;
}
