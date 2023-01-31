import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decode, verify, sign, JwtPayload } from 'jsonwebtoken';

@Injectable()
export class TokenService {
  constructor(private readonly config: ConfigService) {}

  sign(claims: Record<string, string | number>): string {
    return sign(claims, this.config.get('token.secret', 'secret'), {
      expiresIn: this.config.get('token.expiresIn', '1d'),
    });
  }

  verify(token: string) {
    return verify(token, this.config.get('SECRET'));
  }

  decode(token: string): JwtPayload {
    return <JwtPayload>decode(token);
  }
}
