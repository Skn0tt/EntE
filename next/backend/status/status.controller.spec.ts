import { Test, TestingModule } from "@nestjs/testing";
import { StatusController } from "./status.controller";
import { setupEnvVars } from "../../test/setup";
import { StatusService, HealthReport } from "./status.service";

const mockReport = {
  isHealthy: true,
  dependencies: { redis: true, signer: true, db: true },
};

const statusServiceMock: StatusService = {
  async getStatus(): Promise<HealthReport> {
    return mockReport;
  },
} as any;

describe("Status Controller", () => {
  let module: TestingModule;
  beforeAll(async () => {
    setupEnvVars();
    module = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: StatusService,
          useValue: statusServiceMock,
        },
      ],
    }).compile();
  });
  it("should be defined", () => {
    const controller: StatusController = module.get<StatusController>(
      StatusController
    );
    expect(controller).toBeDefined();
  });

  describe("requesting status", () => {
    it("should return a status report", async () => {
      const controller: StatusController = module.get<StatusController>(
        StatusController
      );

      const result = await controller.status();
      expect(result).toEqual(mockReport);
    });
  });
});
