import { Test, TestingModule } from "@nestjs/testing";
import { PasswordResetTokenService } from "./password-token.service";
import { setupEnvVars } from "../../test/helpers/backend";

describe("PasswordResetTokenService", () => {
  let service: PasswordResetTokenService;
  beforeAll(async () => {
    setupEnvVars();
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordResetTokenService],
    }).compile();
    service = module.get<PasswordResetTokenService>(PasswordResetTokenService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
