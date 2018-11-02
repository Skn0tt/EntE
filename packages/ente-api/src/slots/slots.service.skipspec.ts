import { Test, TestingModule } from "@nestjs/testing";
import { SlotsService } from "./slots.service";
import { setupEnvVars } from "../../test/setup";

describe("SlotsService", () => {
  let service: SlotsService;
  beforeAll(async () => {
    setupEnvVars();
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlotsService]
    }).compile();
    service = module.get<SlotsService>(SlotsService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
