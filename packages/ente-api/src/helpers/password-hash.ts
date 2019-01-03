import * as bcrypt from "bcrypt";
import { UserDto, CreateUserDto } from "ente-types";
import { CreateUserDtoWithHash } from "../db/user.repo";

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

export const hashPasswordsOfUsers = async (...users: CreateUserDto[]) => {
  const withHash: CreateUserDtoWithHash[] = await Promise.all(
    users.map(async u => ({
      hash: !!u.password ? await hashPassword(u.password) : undefined,
      user: u
    }))
  );

  return withHash;
};
