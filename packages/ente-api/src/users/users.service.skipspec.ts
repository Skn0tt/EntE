import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { setupEnvVars } from "../../test/setup";

describe("UsersService", () => {
  let service: UsersService;
  beforeAll(async () => {
    setupEnvVars();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService]
    }).compile();
    service = module.get<UsersService>(UsersService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
