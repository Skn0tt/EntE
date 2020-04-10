import { BlackedUserDto, UserDto } from "./user.dto";
import { BlackedEntryDto } from "./entry.dto";
import { BlackedSlotDto } from "./slot.dto";

export class LoginDto {
  token: string;
  oneSelf: UserDto;
  onesEntries: BlackedEntryDto[];
  prefiledSlots: BlackedSlotDto[];
  neededUsers: BlackedUserDto[];
  reviewedRecords: string[];
}
