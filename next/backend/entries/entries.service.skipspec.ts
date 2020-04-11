import { Test, TestingModule } from "@nestjs/testing";
import { EntriesService } from "./entries.service";
import { setupEnvVars } from "../../test/setup";

describe("EntriesService", () => {
  let service: EntriesService;
  beforeAll(async () => {
    setupEnvVars();
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntriesService],
    }).compile();
    service = module.get<EntriesService>(EntriesService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
