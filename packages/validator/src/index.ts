import * as _ from "lodash";

export type Validator<T> = (v: T) => boolean | Promise<boolean>;

export type SyncValidator<T> = (v: T) => boolean;
export type AsyncValidator<T> = (v: T) => Promise<boolean>;

export * from "./auth";
export * from "./entry";
export * from "./user";
