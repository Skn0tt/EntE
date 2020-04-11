import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { setupEnvVars } from "../../test/setup";
import { mocks } from "../../test/mocks/entities";
import { UsersService } from "./users.service";
import { Success } from "monet";
import * as _ from "lodash";
import { NO_PAGINATION_INFO } from "../helpers/pagination-info";

const usersServiceMock: UsersService = {
  async createUsers() {
    return Success([mocks.users.students.tomTallis]);
  },
  async findOne(id: string) {
    if (id !== "exists") {
      throw new Error();
    }

    return Success(mocks.users.students.tomTallis);
  },
  async findAll() {
    return Success(mocks.users.allUsers);
  },
  async findAllTeachers() {
    return _.values(mocks.users.teachers);
  },
  async patchUser() {
    return Success(mocks.users.teachers.benBongo);
  },
} as any;

describe("Users Controller", () => {
  let module: TestingModule;
  beforeAll(async () => {
    setupEnvVars();
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();
  });
  it("should be defined", () => {
    const controller: UsersController = module.get<UsersController>(
      UsersController
    );
    expect(controller).toBeDefined();
  });

  describe("find all users", () => {
    it("should return all users", async () => {
      const controller: UsersController = module.get<UsersController>(
        UsersController
      );
      const result = await controller.findAll(
        { user: mocks.users.admin },
        NO_PAGINATION_INFO
      );
      expect(result).toEqual(mocks.users.allUsers);
    });
  });

  describe("find one user", () => {
    describe("when user exists", () => {
      it("should return the user", async () => {
        const controller: UsersController = module.get<UsersController>(
          UsersController
        );
        const result = await controller.find("exists", {
          user: mocks.users.admin,
        });
        expect(result).toEqual(mocks.users.students.tomTallis);
      });
    });

    describe("when user does not exist", () => {
      it("should throw error", async () => {
        const controller: UsersController = module.get<UsersController>(
          UsersController
        );
        expect(
          controller.find("notexists", { user: mocks.users.admin })
        ).rejects.toBeInstanceOf(Error);
      });
    });
  });

  describe("patch user", () => {
    it("should return the user", async () => {
      const controller: UsersController = module.get<UsersController>(
        UsersController
      );
      const result = await controller.patchUser(
        "id",
        {},
        { user: mocks.users.admin }
      );
      expect(result).toEqual(mocks.users.teachers.benBongo);
    });
  });

  describe("create user", () => {
    it("should return the created users", async () => {
      const controller: UsersController = module.get<UsersController>(
        UsersController
      );
      const result = await controller.createUsers([], {
        user: mocks.users.admin,
      });
      expect(result).toEqual([mocks.users.students.tomTallis]);
    });
  });
});
