import { Test, TestingModule } from "@nestjs/testing";
import { PasswordResetController } from "./password-reset.controller";
import { setupEnvVars } from "../../test/setup";
import { PasswordResetService } from "./password-reset.service";
import { Success } from "monet";

const passwordResetServiceMock: PasswordResetService = {
  getPasswordResetLink(t) {
    return t;
  },
  async setNewPassword(token, newPassword) {
    return Success(true);
  },
  async startPasswordResetRoutine(username) {
    return Success(true);
  }
} as any;

describe("PasswordReset Controller", () => {
  let module: TestingModule;
  beforeAll(async () => {
    setupEnvVars();
    module = await Test.createTestingModule({
      controllers: [PasswordResetController],
      providers: [
        {
          provide: PasswordResetService,
          useValue: passwordResetServiceMock
        }
      ]
    }).compile();
  });
  it("should be defined", () => {
    const controller: PasswordResetController = module.get<
      PasswordResetController
    >(PasswordResetController);
    expect(controller).toBeDefined();
  });
});