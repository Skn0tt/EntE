import { Test, TestingModule } from "@nestjs/testing";
import { StatusController } from "./status.controller";
import { setupEnvVars } from "../../test/setup";
import { StatusService } from "./status.service";
import { Success } from "monet";

const statusServiceMock: StatusService = {
  async getStatus() {
    return Success(true);
  }
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
          useValue: statusServiceMock
        }
      ]
    }).compile();
  });
  it("should be defined", () => {
    const controller: StatusController = module.get<StatusController>(
      StatusController
    );
    expect(controller).toBeDefined();
  });

  describe("requesting status", () => {
    it("should return void", async () => {
      const controller: StatusController = module.get<StatusController>(
        StatusController
      );

      const result = await controller.status();
      expect(result).toBeUndefined();
    });
  });
});
