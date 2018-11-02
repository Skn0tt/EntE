import * as bcrypt from "bcrypt";

const saltRounds = 12;

export async function checkPassword(
  hash: string,
  candidate: string
): Promise<boolean> {
  return await bcrypt.compare(candidate, hash);
}

export async function hashPassword(candidate: string): Promise<string> {
  return await bcrypt.hash(candidate, saltRounds);
}
