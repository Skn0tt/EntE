import { Test, TestingModule } from "@nestjs/testing";
import { TokenService } from "./token.service";
import { setupEnvVars } from "../../test/helpers/backend";

describe("TokenService", () => {
  let service: TokenService;
  beforeAll(async () => {
    setupEnvVars();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();
    service = module.get<TokenService>(TokenService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
