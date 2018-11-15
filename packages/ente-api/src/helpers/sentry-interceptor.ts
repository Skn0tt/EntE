import {
  NestInterceptor,
  ExecutionContext,
  Injectable,
  OnModuleInit
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { UserDto } from "ente-types";
import * as Sentry from "@sentry/node";
import { Config } from "./config";
import { Request } from "express";

@Injectable()
export class SentryInterceptor implements NestInterceptor, OnModuleInit {
  private readonly sentryClient: Sentry.NodeClient;

  constructor(dsn: string) {
    const baseUrl = Config.getBaseUrl();
    const version = Config.getVersion();

    this.sentryClient = new Sentry.NodeClient({
      dsn,
      release: version,
      serverName: baseUrl
    });
  }

  onModuleInit() {
    this.sentryClient.install();
  }

  intercept(
    context: ExecutionContext,
    call$: Observable<any>
  ): Observable<any> {
    const httpRequest = context.switchToHttp().getRequest() as Request | null;
    const userData: UserDto | null = !!httpRequest ? httpRequest.user : null;

    return call$.pipe(
      tap(null, exception => {
        if (this.shouldReport(exception)) {
          Sentry.withScope(scope => {
            if (!!userData) {
              scope.setUser({
                email: userData.email,
                id: userData.id,
                ip_address: httpRequest && httpRequest.ip,
                username: userData.username
              });
            }

            this.sentryClient.captureException(
              exception,
              {
                data: httpRequest
              },
              scope
            );
          });
        }
      })
    );
  }

  shouldReport(exc: Error): boolean {
    return true;
  }
}
