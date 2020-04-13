import { Maybe, None } from "monet";
import { SelectQueryBuilder } from "typeorm";
import { createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import * as _ from "lodash";

export interface PaginationInformation {
  offset: Maybe<number>;
  limit: Maybe<number>;
}

export const NO_PAGINATION_INFO: PaginationInformation = {
  offset: None(),
  limit: None(),
};

export const withPagination = (info: PaginationInformation) => <T>(
  _qB: SelectQueryBuilder<T>
): SelectQueryBuilder<T> => {
  let qB = _qB;

  info.offset.forEach((offset) => {
    qB = qB.skip(offset);
  });

  info.limit.forEach((limit) => {
    qB = qB.take(limit);
  });

  return qB;
};

const fromQuery = (q: any) => Maybe.fromUndefined(Number(q)).filterNot(_.isNaN);

export const PaginationInfo = createParamDecorator(
  (_, req: Request): PaginationInformation => {
    const { limit, offset } = req.query || {};
    return {
      limit: fromQuery(limit),
      offset: fromQuery(offset),
    };
  }
);
