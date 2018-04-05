import * as _ from "lodash";

export type Validator<T> = SyncValidator<T> | AsyncValidator<T>;

export type SyncValidator<T> = (v: T) => boolean;
export type AsyncValidator<T> = (v: T) => Promise<boolean>;

export * from "./auth";
export * from "./entry";
export * from "./user";
