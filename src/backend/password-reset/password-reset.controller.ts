import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  NotFoundException,
  ForbiddenException,
  Inject,
  BadRequestException,
} from "@nestjs/common";
import {
  PasswordResetService,
  StartPasswordRoutineFailure,
  SetNewPasswordFailure,
} from "./password-reset.service";

@Controller("passwordReset")
export class PasswordResetController {
  constructor(
    @Inject(PasswordResetService)
    private readonly authService: PasswordResetService
  ) {}

  @Post("/:username")
  async forgotPassword(@Param("username") username: string) {
    const result = await this.authService.invokePasswordResetRoutine(username);
    result.forEachFail((fail) => {
      switch (fail) {
        case StartPasswordRoutineFailure.UserNotFound:
          throw new NotFoundException();
        default:
          throw new ForbiddenException();
      }
    });
  }

  @Put("/:token")
  async setNewPassword(
    @Param("token") token: string,
    @Body() newPassword: string
  ) {
    const result = await this.authService.setNewPassword(token, newPassword);
    result.cata(
      (fail) => {
        switch (fail) {
          case SetNewPasswordFailure.TokenUnknown:
            throw new NotFoundException();
          case SetNewPasswordFailure.PasswordIllegal:
            throw new BadRequestException("Password illegal");
          case SetNewPasswordFailure.TokenExpired:
            throw new NotFoundException();
          case SetNewPasswordFailure.UserNotFound:
            throw new NotFoundException();
          default:
            throw new ForbiddenException();
        }
      },
      () => {}
    );
  }
}
