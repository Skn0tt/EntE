import { Maybe } from "monet";
import { SelectQueryBuilder } from "typeorm";
import { createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import * as _ from "lodash";

export interface PaginationInformation {
  offset: Maybe<number>;
  limit: Maybe<number>;
}

export const withPagination = (info: PaginationInformation) => <T>(
  _qB: SelectQueryBuilder<T>
): SelectQueryBuilder<T> => {
  let qB = _qB;

  if (info.offset.isSome()) {
    qB = qB.skip(info.offset.some());
  }

  if (info.limit.isSome()) {
    qB = qB.take(info.limit.some());
  }

  return qB;
};

const fromQuery = (q: any) => Maybe.fromUndefined(Number(q)).filterNot(_.isNaN);

export const PaginationInfo = createParamDecorator(
  (_, req: Request): PaginationInformation => {
    const { limit, offset } = req.query;
    return {
      limit: fromQuery(limit),
      offset: fromQuery(offset)
    };
  }
);
