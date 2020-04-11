import {
  Controller,
  Post,
  Body,
  Inject,
  BadRequestException,
  ForbiddenException,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ValidationPipe } from "../helpers/validation.pipe";
import { CreateUserDto } from "@@types";
import { ArrayBodyTransformPipe } from "../pipes/array-body-transform.pipe";
import { RequestContext, Ctx } from "../helpers/request-context";
import { InstanceService, ImportUsersFailure } from "./instance.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("instance")
@UseGuards(AuthGuard("combined"))
export class InstanceController {
  constructor(
    @Inject(InstanceService) private readonly instanceService: InstanceService
  ) {}

  @Post("import")
  async importUsers(
    @Body(
      new ArrayBodyTransformPipe(),
      new ValidationPipe({ array: true, type: CreateUserDto })
    )
    users: CreateUserDto[],
    @Ctx() requestContext: RequestContext,
    @Query("deleteEntries") _deleteEntries: string,
    @Query("deleteUsers") _deleteUsers: string,
    @Query("deleteStudentsAndParents") _deleteStudentsAndParents: string
  ) {
    const deleteEntries = _deleteEntries === "true";
    const deleteUsers = _deleteUsers === "true";
    const deleteStudentsAndParents = _deleteStudentsAndParents === "true";
    const result = await this.instanceService.importUsers(
      users,
      requestContext.user,
      deleteEntries,
      deleteUsers,
      deleteStudentsAndParents
    );
    return result.cata(
      (fail) => {
        switch (fail) {
          case ImportUsersFailure.IllegalDtos:
            throw new BadRequestException();
          case ImportUsersFailure.UsersNotFound:
            throw new BadRequestException("users not found");
          case ImportUsersFailure.ForbiddenForRole:
            throw new ForbiddenException();
        }
      },
      (users) => users
    );
  }
}
