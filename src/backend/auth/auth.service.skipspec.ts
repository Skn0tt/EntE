import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { setupEnvVars } from "../../test/helpers/backend";

describe("AuthService", () => {
  let service: AuthService;
  beforeAll(async () => {
    setupEnvVars();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
