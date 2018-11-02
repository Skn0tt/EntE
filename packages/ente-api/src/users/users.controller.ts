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
  UseGuards
} from "@nestjs/common";
import {
  UsersService,
  CreateUsersFailure,
  PatchUserFailure,
  FindAllUsersFailure,
  FindOneUserFailure
} from "./users.service";
import { Ctx, RequestContext } from "../helpers/request-context";
import { ArrayBodyTransformPipe } from "../pipes/array-body-transform.pipe";
import { AuthGuard } from "@nestjs/passport";
import { UserDto, CreateUserDto, PatchUserDto } from "ente-types";
import { ValidationPipe } from "../helpers/validation.pipe";

@Controller("users")
@UseGuards(AuthGuard("combined"))
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService
  ) {}

  @Get()
  async findAll(@Ctx() ctx: RequestContext): Promise<UserDto[]> {
    const result = await this.usersService.findAll(ctx.user);
    return result.cata(fail => {
      switch (fail) {
        case FindAllUsersFailure.ForbiddenForRole:
          throw new ForbiddenException();
      }
    }, u => u);
  }

  @Get(":id")
  async find(
    @Param("id") id: string,
    @Ctx() ctx: RequestContext
  ): Promise<UserDto> {
    const result = await this.usersService.findOne(id, ctx.user);
    return result.cata(fail => {
      switch (fail) {
        case FindOneUserFailure.ForbiddenForUser:
          throw new ForbiddenException();
        case FindOneUserFailure.UserNotFound:
          throw new NotFoundException();
      }
    }, user => user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUsers(
    @Body(
      new ArrayBodyTransformPipe(),
      new ValidationPipe({ array: true, arrayType: CreateUserDto })
    )
    users: CreateUserDto[],
    @Ctx() ctx: RequestContext
  ) {
    const result = await this.usersService.createUsers(users, ctx.user);

    return result.cata(fail => {
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
    }, u => u);
  }

  @Patch(":id")
  async patchUser(
    @Param("id") id: string,
    @Body(new ValidationPipe())
    patch: PatchUserDto,
    @Ctx() ctx: RequestContext
  ) {
    const result = await this.usersService.patchUser(id, patch, ctx.user);

    return result.cata(fail => {
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
    }, u => u);
  }
}
