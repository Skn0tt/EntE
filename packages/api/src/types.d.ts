declare namespace Express {
  export interface Request {
    entries?: IEntry[];
    users?: IUser[];
    slots?: ISlot[];
    user: IUser;
  }
  export interface Response {
    sentry: string;
  }
}
