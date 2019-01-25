import { UserDto } from "./user.dto";
import { EntryDto } from "./entry.dto";

export class LoginDto {
  token: string;
  oneSelf: UserDto;
  onesEntries: EntryDto[];
  neededUsers: UserDto[];
}
