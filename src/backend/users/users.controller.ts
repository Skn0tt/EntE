import {
  Controller,
  Get,
  Param,
  ForbiddenException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  ConflictException,
  BadRequestException,
  Patch,
  Inject,
  UseGuards,
  Delete,
  Put,
} from "@nestjs/common";
import {
  UsersService,
  CreateUsersFailure,
  PatchUserFailure,
  FindAllUsersFailure,
  FindOneUserFailure,
  DeleteUserFailure,
  SetLanguageFailure,
  InvokeInvitationEmailFailure,
  UpdateManagerNotesFailure,
  PromoteTeacherFailure,
  DemoteManagerFailure,
} from "./users.service";
import { Ctx, RequestContext } from "../helpers/request-context";
import { ArrayBodyTransformPipe } from "../pipes/array-body-transform.pipe";
import { AuthGuard } from "@nestjs/passport";
import {
  UserDto,
  CreateUserDto,
  PatchUserDto,
  Languages,
  BlackedUserDto,
  isValidClass,
} from "@@types";
import { ValidationPipe } from "../helpers/validation.pipe";
import {
  PaginationInfo,
  PaginationInformation,
} from "../helpers/pagination-info";
import { UIStateService } from "./ui-state.service";

@Controller("users")
@UseGuards(AuthGuard("combined"))
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(UIStateService) private readonly uiStateService: UIStateService
  ) {}

  @Get()
  async findAll(
    @Ctx() ctx: RequestContext,
    @PaginationInfo() pInfo: PaginationInformation
  ): Promise<BlackedUserDto[]> {
    const result = await this.usersService.findAll(ctx.user, pInfo);
    return result.cata(
      (fail) => {
        switch (fail) {
          case FindAllUsersFailure.ForbiddenForRole:
            throw new ForbiddenException();
        }
      },
      (u) => u
    );
  }

  @Get(":id")
  async find(
    @Param("id") id: string,
    @Ctx() ctx: RequestContext
  ): Promise<BlackedUserDto> {
    const result = await this.usersService.findOne(id, ctx.user);
    return result.cata(
      (fail) => {
        switch (fail) {
          case FindOneUserFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case FindOneUserFailure.UserNotFound:
            throw new NotFoundException();
        }
      },
      (user) => user
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUsers(
    @Body(
      new ArrayBodyTransformPipe(),
      new ValidationPipe({ array: true, type: CreateUserDto })
    )
    users: CreateUserDto[],
    @Ctx() ctx: RequestContext
  ): Promise<UserDto[]> {
    const result = await this.usersService.createUsers(users, ctx.user);

    return result.cata(
      (fail) => {
        switch (fail) {
          case CreateUsersFailure.UserAlreadyExists:
            throw new ConflictException();
          case CreateUsersFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case CreateUsersFailure.ChildrenNotFound:
            throw new BadRequestException("Children not found");
          default:
            throw new ForbiddenException();
        }
      },
      (u) => u
    );
  }

  @Patch(":id")
  async patchUser(
    @Param("id") id: string,
    @Body(new ValidationPipe({ array: false, type: PatchUserDto }))
    patch: PatchUserDto,
    @Ctx() ctx: RequestContext
  ): Promise<UserDto> {
    const result = await this.usersService.patchUser(id, patch, ctx.user);

    return result.cata(
      (fail) => {
        switch (fail) {
          case PatchUserFailure.ForbiddenForRole:
            throw new ForbiddenException();
          case PatchUserFailure.UserNotFound:
            throw new NotFoundException();
          case PatchUserFailure.IllegalPatch:
            throw new BadRequestException();
          default:
            throw new ForbiddenException();
        }
      },
      (u) => u
    );
  }

  @Put(":id/language")
  async setLanguage(
    @Param("id") id: string,
    @Body() language: string,
    @Ctx() ctx: RequestContext
  ) {
    const result = await this.usersService.setLanguage(
      id,
      language as Languages,
      ctx.user
    );

    return result.cata(
      (fail) => {
        switch (fail) {
          case SetLanguageFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case SetLanguageFailure.UserNotFound:
            throw new NotFoundException();
          case SetLanguageFailure.IllegalLanguage:
            throw new BadRequestException();
          default:
            throw new ForbiddenException();
        }
      },
      (u) => {}
    );
  }

  @Delete(":id")
  async delete(
    @Param("id") id: string,
    @Ctx() ctx: RequestContext
  ): Promise<UserDto> {
    const result = await this.usersService.delete(id, ctx.user);
    return result.cata(
      (fail) => {
        switch (fail) {
          case DeleteUserFailure.ForbiddenForRole:
            throw new ForbiddenException();
          case DeleteUserFailure.UserNotFound:
            throw new NotFoundException();
        }
      },
      (user) => user
    );
  }

  @Post(":id/invokeInvitationRoutine")
  async invokeInvitationRoutine(
    @Param("id") id: string,
    @Ctx() ctx: RequestContext
  ): Promise<string> {
    const result = await this.usersService.invokeInvitationRoutine(
      id,
      ctx.user
    );
    return result.cata(
      (fail) => {
        switch (fail) {
          case InvokeInvitationEmailFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case InvokeInvitationEmailFailure.UserNotFound:
            throw new NotFoundException();
        }
      },
      () => "Successfully invoked routine."
    );
  }

  @Post(":id/promote")
  async promoteTeacherToBeManager(
    @Param("id") id: string,
    @Body() _class: string,
    @Ctx() ctx: RequestContext
  ): Promise<string> {
    if (!isValidClass(_class)) {
      throw new BadRequestException(
        "Please provide an alphanumeric string for `class`."
      );
    }
    const result = await this.usersService.promoteTeacher(id, _class, ctx.user);
    return result.cata(
      (fail) => {
        switch (fail) {
          case PromoteTeacherFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case PromoteTeacherFailure.TeacherNotFound:
            throw new NotFoundException();
        }
      },
      () => "Successfully promoted."
    );
  }

  @Post(":id/demote")
  async demoteManagerToBeTeacher(
    @Param("id") id: string,
    @Ctx() ctx: RequestContext
  ): Promise<string> {
    const result = await this.usersService.demoteManager(id, ctx.user);
    return result.cata(
      (fail) => {
        switch (fail) {
          case DemoteManagerFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case DemoteManagerFailure.ManagerNotFound:
            throw new NotFoundException();
        }
      },
      () => "Successfully demoted."
    );
  }

  @Put(":id/managerNotes")
  async setManagerNotes(
    @Param("id") id: string,
    @Body() value: string,
    @Ctx() ctx: RequestContext
  ): Promise<string> {
    const result = await this.usersService.updateManagerNotes(
      id,
      value,
      ctx.user
    );
    return result.cata(
      (fail) => {
        switch (fail) {
          case UpdateManagerNotesFailure.ForbiddenForUser:
            throw new ForbiddenException();
          case UpdateManagerNotesFailure.StudentNotFound:
            throw new NotFoundException();
        }
      },
      () => value
    );
  }

  @Get(":id/uiState")
  async getUIConfig(
    @Param("id") id: string,
    @Ctx() ctx: RequestContext
  ): Promise<string> {
    const userId = ctx.user.id;
    if (id !== userId) {
      throw new ForbiddenException();
    }
    const uiState = await this.uiStateService.get(userId);
    return uiState;
  }

  @Put(":id/uiState")
  async settUIConfig(
    @Param("id") id: string,
    @Body() value: string,
    @Ctx() ctx: RequestContext
  ): Promise<void> {
    const userId = ctx.user.id;
    if (id !== userId) {
      throw new ForbiddenException();
    }
    await this.uiStateService.set(userId, value);
  }
}
