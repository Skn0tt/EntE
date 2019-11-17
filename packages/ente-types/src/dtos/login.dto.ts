import { BlackedUserDto, UserDto } from "./user.dto";
import { BlackedEntryDto } from "./entry.dto";

export class LoginDto {
  token: string;
  oneSelf: UserDto;
  onesEntries: BlackedEntryDto[];
  neededUsers: BlackedUserDto[];
  reviewedRecords: string[];
}
