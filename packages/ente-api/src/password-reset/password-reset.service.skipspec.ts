import { Test, TestingModule } from "@nestjs/testing";
import { PasswordResetService } from "./password-reset.service";
import { setupEnvVars } from "../../test/setup";

describe("PasswordResetService", () => {
  let service: PasswordResetService;
  beforeAll(async () => {
    setupEnvVars();
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordResetService]
    }).compile();
    service = module.get<PasswordResetService>(PasswordResetService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
