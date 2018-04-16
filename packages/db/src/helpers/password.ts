import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

export const validatePassword = (hash: string, attempt: string) =>
  bcrypt.compare(attempt, hash);

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

export const randomToken = async (length: number) => {
  const buffer = await crypto.randomBytes(length);
  const token = buffer.toString("hex");
  return token;
};
