import { Test, TestingModule } from "@nestjs/testing";
import { SlotsController } from "./slots.controller";
import { setupEnvVars } from "../../test/setup";
import { SlotsService } from "./slots.service";
import { Success } from "monet";
import { mocks } from "../../test/mocks/entities";

const slotsServiceMock: SlotsService = {
  async findAll(r) {
    return [mocks.slots.slot];
  },
  async findOne(id, r) {
    if (id !== "exists") {
      throw new Error();
    }

    return Success(mocks.slots.slot);
  }
} as any;

describe("Slots Controller", () => {
  let module: TestingModule;
  beforeAll(async () => {
    setupEnvVars();
    module = await Test.createTestingModule({
      controllers: [SlotsController],
      providers: [
        {
          provide: SlotsService,
          useValue: slotsServiceMock
        }
      ]
    }).compile();
  });

  it("should be defined", () => {
    const controller: SlotsController = module.get<SlotsController>(
      SlotsController
    );
    expect(controller).toBeDefined();
  });

  describe("requesting all slots", () => {
    it("should return one slot", async () => {
      const controller: SlotsController = module.get<SlotsController>(
        SlotsController
      );
      const result = await controller.findAll({ user: mocks.users.admin });
      expect(result).toEqual([mocks.slots.slot]);
    });
  });

  describe("requesting one slot", () => {
    describe("that exists", () => {
      it("should return that slot", async () => {
        const controller: SlotsController = module.get<SlotsController>(
          SlotsController
        );
        const result = await controller.findOne("exists", {
          user: mocks.users.admin
        });
        expect(result).toEqual(mocks.slots.slot);
      });
    });

    describe("that does not exist", () => {
      it("should throw error", async () => {
        const controller: SlotsController = module.get<SlotsController>(
          SlotsController
        );
        await expect(
          controller.findOne("notexists", { user: mocks.users.admin })
        ).rejects.toBeInstanceOf(Error);
      });
    });
  });
});
