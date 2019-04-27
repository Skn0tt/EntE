import { Injectable, Inject } from "@nestjs/common";
import { RequestContextUser } from "../helpers/request-context";
import { LoginDto, Roles, EntryDto, TEACHING_ROLES, UserDto } from "ente-types";
import { TokenService } from "../token/token.service";
import { EntryRepo } from "../db/entry.repo";
import { UserRepo } from "../db/user.repo";
import { NO_PAGINATION_INFO } from "../helpers/pagination-info";
import { EntriesService } from "../entries/entries.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class LoginService {
  constructor(
    @Inject(TokenService)
    private readonly tokenService: TokenService,
    @Inject(EntryRepo)
    private readonly entryRepo: EntryRepo,
    @Inject(UserRepo)
    private readonly userRepo: UserRepo
  ) {}

  async getLoginData(user: RequestContextUser): Promise<LoginDto> {
    const token = await this.tokenService.createToken(user);

    const oneSelf = (await user.getDto()).some();

    return {
      token,
      oneSelf,
      onesEntries: (await this.getOnesEntries(oneSelf)).map(e =>
        EntriesService.blackenDto(e, user.role)
      ),
      neededUsers: (await this.getNeededUsers(oneSelf)).map(e =>
        UsersService.blackenDto(e, user.role)
      )
    };
  }

  private async getOnesEntries(user: UserDto): Promise<EntryDto[]> {
    switch (user.role) {
      case Roles.ADMIN:
        return await this.entryRepo.findAll(NO_PAGINATION_INFO);
      case Roles.PARENT:
        return await this.entryRepo.findByStudents(
          user.children.map(c => c.id),
          NO_PAGINATION_INFO
        );
      case Roles.STUDENT:
        return await this.entryRepo.findByStudents(
          [user.id],
          NO_PAGINATION_INFO
        );
      case Roles.MANAGER:
        return await this.entryRepo.findByYear(
          user.graduationYear!,
          NO_PAGINATION_INFO
        );
      default:
        return [];
    }
  }

  private async getNeededUsers(user: UserDto): Promise<UserDto[]> {
    switch (user.role) {
      case Roles.ADMIN:
        return await this.userRepo.findAll(NO_PAGINATION_INFO);
      case Roles.PARENT:
        return [
          ...(await this.userRepo.findByRoles(...TEACHING_ROLES)),
          ...(await this.userRepo.findByIds(...user.children.map(c => c.id))),
          user
        ];
      case Roles.STUDENT:
        return [...(await this.userRepo.findByRoles(...TEACHING_ROLES)), user];
      case Roles.MANAGER:
        return [
          ...(await this.userRepo.findByGraduationYear(user.graduationYear!))
        ];
      case Roles.TEACHER:
        return [user];
      default:
        return [];
    }
  }
}
