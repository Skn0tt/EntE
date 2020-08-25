import { PassportStrategy, AuthGuard } from "@nestjs/passport";
import { Strategy as CustomStrategy } from "passport-custom";
import {
  UnauthorizedException,
  Injectable,
  UseGuards,
  Inject,
} from "@nestjs/common";
import { BasicStrategy } from "./basic.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { RequestContextUser } from "../helpers/request-context";
import type { IncomingMessage } from "http";
import basicAuth from "basic-auth";

const BEARER_REGEX = /(?<=Bearer )(\S+)/gm;

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

  async validate(req: IncomingMessage): Promise<RequestContextUser> {
    const basicAuthHeaders = basicAuth(req);
    const isBasicAuth = !!basicAuthHeaders;
    if (isBasicAuth) {
      return await this.basicStrategy.validate(
        basicAuthHeaders!.name,
        basicAuthHeaders!.pass,
        req
      );
    }

    const authorization = (req.headers["x-authorization"] ?? req.headers.authorization ?? "") as string;
    const isBearerAuth = BEARER_REGEX.test(authorization);
    if (isBearerAuth) {
      const token = authorization.match(BEARER_REGEX)![0];

      return await this.jwtStrategy.validate(token);
    }

    throw new UnauthorizedException();
  }
}
