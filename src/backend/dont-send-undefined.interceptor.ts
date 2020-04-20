import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { map } from "rxjs/operators";
import * as _ from "lodash";

function emptyStringIfUndefined(v: any) {
  if (_.isUndefined(v)) {
    return "";
  }

  return v;
}

@Injectable()
export class DontSendUndefinedInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map(emptyStringIfUndefined));
  }
}
