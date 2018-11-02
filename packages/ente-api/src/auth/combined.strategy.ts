import { PassportStrategy, AuthGuard } from "@nestjs/passport";
import * as CustomStrategy from "passport-custom";
import {
  UnauthorizedException,
  Inject,
  Injectable,
  UseGuards
} from "@nestjs/common";
import { BasicStrategy } from "./basic.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { Request } from "express";

const BEARER_REGEX = /(?<=Bearer )(\S+)/gm;
const BASIC_REGEX = /(?<=Basic )(\S+)/gm;

@Injectable()
@UseGuards(AuthGuard("combined"))
export class CombinedStrategy extends PassportStrategy(
  CustomStrategy,
  "combined"
) {
  constructor(
    @Inject(BasicStrategy) private readonly basicStrategy: BasicStrategy,
    @Inject(JwtStrategy) private readonly jwtStrategy: JwtStrategy
  ) {
    super();
  }

  async validate(req: Request) {
    const authorization = req.headers.authorization as string;

    const isBasicAuth = BASIC_REGEX.test(authorization);
    if (isBasicAuth) {
      const b64 = authorization.match(BASIC_REGEX)[0];
      const text = Buffer.from(b64, "base64").toString("ascii");
      const [username, password] = text.split(":");

      return await this.basicStrategy.validate(username, password);
    }

    const isBearerAuth = BEARER_REGEX.test(authorization);
    if (isBearerAuth) {
      const token = authorization.match(BEARER_REGEX)[0];

      return await this.jwtStrategy.validate(token);
    }

    throw new UnauthorizedException();
  }
}
