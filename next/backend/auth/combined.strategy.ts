import { PassportStrategy, AuthGuard } from "@nestjs/passport";
import * as CustomStrategy from "passport-custom";
import {
  UnauthorizedException,
  Inject,
  Injectable,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { BasicStrategy } from "./basic.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { Request } from "express";
import { Base64, CharacterSets } from "../helpers/base64";
import { Maybe, Some, None } from "monet";
import { RequestContextUser } from "../helpers/request-context";

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

  async validate(req: Request): Promise<RequestContextUser> {
    const authorization = req.headers.authorization as string;

    const isBasicAuth = BASIC_REGEX.test(authorization);
    if (isBasicAuth) {
      const b64 = authorization.match(BASIC_REGEX)![0];
      const text = Base64.decode(b64, CharacterSets.LATIN_1);
      const creds = CombinedStrategy.extractCredentials(text);
      if (creds.isNone()) {
        throw new BadRequestException();
      }

      const { username, password } = creds.some();

      return await this.basicStrategy.validate(username, password);
    }

    const isBearerAuth = BEARER_REGEX.test(authorization);
    if (isBearerAuth) {
      const token = authorization.match(BEARER_REGEX)![0];

      return await this.jwtStrategy.validate(token);
    }

    throw new UnauthorizedException();
  }

  static extractCredentials(
    s: string
  ): Maybe<{ username: string; password: string }> {
    if (s.indexOf(":") === -1) {
      return None();
    }

    const username = s.slice(0, s.indexOf(":"));
    const password = s.slice(s.indexOf(":") + 1);

    return Some({ username, password });
  }
}
