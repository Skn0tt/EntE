import { Injectable, Inject } from "@nestjs/common";
import { RedisService } from "../infrastructure/redis.service";
import { randomBytes } from "crypto";
import { Validation, Success, Fail } from "monet";

interface PasswordResetTokenRedisPayload {
  userId: string;
  expires: number | null;
  isInvitation: boolean;
}

export enum FindTokenFailure {
  TokenNotFound,
  TokenExpired,
}

@Injectable()
export class PasswordResetTokenService {
  constructor(
    @Inject(RedisService) private readonly redisService: RedisService
  ) {}

  async createToken(
    userId: string,
    isInvitation: boolean,
    expiryTimeInMilliSeconds: number | null
  ) {
    const token = await this.generateToken();
    const payload: PasswordResetTokenRedisPayload = {
      userId,
      expires: !!expiryTimeInMilliSeconds
        ? Date.now() + expiryTimeInMilliSeconds
        : null,
      isInvitation,
    };

    if (!!expiryTimeInMilliSeconds) {
      await this.redisService.setWithExpiry(
        token,
        JSON.stringify(payload),
        expiryTimeInMilliSeconds
      );
    } else {
      await this.redisService.set(token, JSON.stringify(payload));
    }

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
      (v) => {
        const { userId, expires, isInvitation } = JSON.parse(
          v
        ) as PasswordResetTokenRedisPayload;
        if (!!expires && Date.now() > expires) {
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
