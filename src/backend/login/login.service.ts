import { Injectable, Inject } from "@nestjs/common";
import { RequestContextUser } from "../helpers/request-context";
import { LoginDto, Roles, EntryDto, UserDto } from "@@types";
import { TokenService } from "../token/token.service";
import { EntryRepo } from "../db/entry.repo";
import { NO_PAGINATION_INFO } from "../helpers/pagination-info";
import { EntriesService } from "../entries/entries.service";
import { UsersService } from "../users/users.service";
import { ReviewedRecordsService } from "../reviewedRecords/reviewedRecords.service";
import { SlotsService } from "../slots/slots.service";
import { SlotRepo } from "../db/slot.repo";

@Injectable()
export class LoginService {
  constructor(
    @Inject(TokenService)
    private readonly tokenService: TokenService,
    @Inject(EntryRepo)
    private readonly entryRepo: EntryRepo,
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(SlotRepo)
    private readonly slotRepo: SlotRepo,
    @Inject(ReviewedRecordsService)
    private readonly reviewedRecordsService: ReviewedRecordsService
  ) {}

  async getLoginData(user: RequestContextUser): Promise<LoginDto> {
    const token = await this.tokenService.createToken(user);

    const oneSelf = (await user.getDto()).some();

    return {
      token,
      oneSelf,
      onesEntries: (await this.getOnesEntries(oneSelf)).map((e) =>
        EntriesService.blackenDto(e, user)
      ),
      prefiledSlots: (await this.getPrefiledSlots(oneSelf)).map((s) =>
        SlotsService.blackenDto(s, user)
      ),
      neededUsers: (
        await this.usersService.findAll(user, NO_PAGINATION_INFO)
      ).success(),
      reviewedRecords: [
        ...(await this.reviewedRecordsService.getReviewedRecords(oneSelf.id)),
      ],
    };
  }

  private async getPrefiledSlots(user: UserDto) {
    switch (user.role) {
      case Roles.STUDENT:
        return await this.slotRepo.findPrefiledForStudent(user.id);
      case Roles.PARENT:
        return await this.slotRepo.findPrefiledForStudents(
          ...user.children.map((c) => c.id)
        );
      case Roles.MANAGER:
      case Roles.TEACHER:
        return await this.slotRepo.findPrefiledCreatedByTeacher(user.id);
      default:
        return [];
    }
  }

  private async getOnesEntries(user: UserDto): Promise<EntryDto[]> {
    switch (user.role) {
      case Roles.PARENT:
        return await this.entryRepo.findByStudents(
          user.children.map((c) => c.id),
          NO_PAGINATION_INFO
        );
      case Roles.STUDENT:
        return await this.entryRepo.findByStudents(
          [user.id],
          NO_PAGINATION_INFO
        );
      case Roles.MANAGER:
        return await this.entryRepo.findByClass(
          user.class!,
          NO_PAGINATION_INFO
        );
      default:
        return [];
    }
  }
}
