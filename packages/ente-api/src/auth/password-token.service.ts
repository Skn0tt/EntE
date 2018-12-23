import { Injectable, Inject } from "@nestjs/common";
import { RedisService } from "../infrastructure/redis.service";
import { hours } from "../helpers/time";
import { randomBytes } from "crypto";
import { Validation, Success, Fail } from "monet";

interface PasswordResetTokenRedisPayload {
  userId: string;
  expires: number;
  isInvitation: boolean;
}

export enum FindTokenFailure {
  TokenNotFound,
  TokenExpired
}

@Injectable()
export class PasswordResetTokenService {
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService
  ) {}

  async createToken(
    userId: string,
    isInvitation: boolean,
    expiryTimeInMilliSeconds: number = hours(24)
  ) {
    const token = await this.generateToken();
    const payload: PasswordResetTokenRedisPayload = {
      userId,
      expires: Date.now() + expiryTimeInMilliSeconds,
      isInvitation
    };

    await this.redisService.setWithExpiry(
      token,
      JSON.stringify(payload),
      expiryTimeInMilliSeconds
    );

    return token;
  }

  async findToken(
    token: string
  ): Promise<
    Validation<FindTokenFailure, { userId: string; isInvitation: boolean }>
  > {
    const value = await this.redisService.get(token);
    return value.cata(
      () => {
        return Fail(FindTokenFailure.TokenNotFound);
      },
      v => {
        const { userId, expires, isInvitation } = JSON.parse(
          v
        ) as PasswordResetTokenRedisPayload;
        if (Date.now() > expires) {
          return Fail(FindTokenFailure.TokenExpired);
        }
        return Success({ userId, isInvitation });
      }
    );
  }

  async destroyToken(token: string) {
    await this.redisService.remove(token);
  }

  async generateToken(length = 30) {
    const buffer = await randomBytes(length);
    const token = buffer.toString("hex");
    return token;
  }
}
