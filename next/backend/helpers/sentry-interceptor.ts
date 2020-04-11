import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  OnModuleInit,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { UserDto } from "ente-types";
import * as Sentry from "@sentry/node";
import { Config } from "./config";
import { Request } from "express";

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  private readonly sentryClient: Sentry.NodeClient;

  constructor(dsn: string) {
    const baseUrl = Config.getBaseUrl();
    const version = Config.getVersion();

    this.sentryClient = new Sentry.NodeClient({
      dsn,
      release: version,
      serverName: baseUrl,
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpRequest = context.switchToHttp().getRequest() as Request | null;
    const userData: UserDto | null = !!httpRequest ? httpRequest.user : null;

    const onException = (exception: any) => {
      if (!this.shouldReport(exception)) {
        return;
      }

      Sentry.withScope((scope) => {
        if (!!userData) {
          scope.setUser({
            email: userData.email,
            id: userData.id,
            ip_address: !!httpRequest ? httpRequest.ip : undefined,
            username: userData.username,
          });
        }

        this.sentryClient.captureException(
          exception,
          {
            data: httpRequest,
          },
          scope
        );
      });
    };

    return next.handle().pipe(tap(undefined, onException));
  }

  shouldReport(exc: Error): boolean {
    return true;
  }
}
