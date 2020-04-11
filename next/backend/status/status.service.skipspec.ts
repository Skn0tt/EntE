import { Test, TestingModule } from "@nestjs/testing";
import { StatusService } from "./status.service";
import { setupEnvVars } from "../../test/setup";

describe("StatusService", () => {
  let service: StatusService;
  beforeAll(async () => {
    setupEnvVars();
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusService],
    }).compile();
    service = module.get<StatusService>(StatusService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
