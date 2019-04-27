import { BlackedUserDto } from "./user.dto";
import { BlackedEntryDto } from "./entry.dto";

export class LoginDto {
  token: string;
  oneSelf: BlackedUserDto;
  onesEntries: BlackedEntryDto[];
  neededUsers: BlackedUserDto[];
}
