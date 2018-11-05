import { Test, TestingModule } from "@nestjs/testing";
import { EntriesController } from "./entries.controller";
import { setupEnvVars } from "../../test/setup";
import { EntriesService } from "./entries.service";
import { Success } from "monet";
import { mocks } from "../../test/mocks/entities";

const s: EntriesService = {
  async create(entry, r) {
    return Success(mocks.entries.entry);
  },
  async findAll(r) {
    return Success([mocks.entries.entry]);
  },
  async findOne() {
    return Success(mocks.entries.entry);
  },
  getSigningLinkForEntry() {
    return "https://yourlink";
  },
  async patch(id, r, u) {
    return Success(mocks.entries.entry);
  }
} as any;

describe.only("Entries Controller", () => {
  let module: TestingModule;
  beforeAll(async () => {
    setupEnvVars();
    module = await Test.createTestingModule({
      controllers: [EntriesController],
      providers: [
        {
          provide: EntriesService,
          useValue: s
        }
      ]
    }).compile();
  });

  it("should be defined", () => {
    const controller: EntriesController = module.get<EntriesController>(
      EntriesController
    );
    expect(controller).toBeDefined();
  });

  describe("getting all entries", () => {
    it("returns mocked entries", async () => {
      const controller: EntriesController = module.get<EntriesController>(
        EntriesController
      );

      const response = await controller.findAll({ user: mocks.users.admin });
      expect(response).toEqual([mocks.entries.entry]);
    });
  });

  describe("getting one entry", () => {
    it("returns mocked entry", async () => {
      const controller: EntriesController = module.get<EntriesController>(
        EntriesController
      );

      const response = await controller.findOne("id", {
        user: mocks.users.admin
      });
      expect(response).toEqual(mocks.entries.entry);
    });
  });

  describe("signing entry", () => {
    it("returns mocked entry", async () => {
      const controller: EntriesController = module.get<EntriesController>(
        EntriesController
      );

      const response = await controller.patch(
        "id",
        { signed: true },
        {
          user: mocks.users.admin
        }
      );
      expect(response).toEqual(mocks.entries.entry);
    });
  });

  describe("setting forSchool", () => {
    it("returns mocked entry", async () => {
      const controller: EntriesController = module.get<EntriesController>(
        EntriesController
      );

      const response = await controller.patch(
        "id",
        { forSchool: true },
        {
          user: mocks.users.admin
        }
      );
      expect(response).toEqual(mocks.entries.entry);
    });
  });

  describe("creating Entry", () => {
    it("returns mocked entry", async () => {
      const controller: EntriesController = module.get<EntriesController>(
        EntriesController
      );

      const response = await controller.create(mocks.createEntry, {
        user: mocks.users.admin
      });
      expect(response).toEqual(mocks.entries.entry);
    });
  });
});
