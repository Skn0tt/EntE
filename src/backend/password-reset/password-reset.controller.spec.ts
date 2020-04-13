import { Test, TestingModule } from "@nestjs/testing";
import { setupEnvVars } from "../../test/helpers/backend";
import { PasswordResetController } from "./password-reset.controller";
import { PasswordResetService } from "./password-reset.service";
import { Success } from "monet";

const passwordResetServiceMock: PasswordResetService = {
  getPasswordResetLink(t: any) {
    return t;
  },
  async setNewPassword() {
    return Success(true);
  },
  async startPasswordResetRoutine() {
    return Success(true);
  },
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
          useValue: passwordResetServiceMock,
        },
      ],
    }).compile();
  });
  it("should be defined", () => {
    const controller: PasswordResetController = module.get<
      PasswordResetController
    >(PasswordResetController);
    expect(controller).toBeDefined();
  });
});
