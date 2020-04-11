import { Test, TestingModule } from "@nestjs/testing";
import { setupEnvVars } from "../../test/helpers/backend";
import { TokenController } from "./token.controller";
import { TokenService } from "./token.service";
import { RequestContextUser } from "../helpers/request-context";

const mockToken = "token";

const tokenServiceMock: TokenService = {
  async createToken() {
    return mockToken;
  },
} as any;

describe("Token Controller", () => {
  let module: TestingModule;
  beforeAll(async () => {
    setupEnvVars();
    module = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        {
          provide: TokenService,
          useValue: tokenServiceMock,
        },
      ],
    }).compile();
  });
  it("should be defined", () => {
    const controller: TokenController = module.get<TokenController>(
      TokenController
    );
    expect(controller).toBeDefined();
  });

  describe("requesting a new token", () => {
    it("should return a valid token", async () => {
      const controller: TokenController = module.get<TokenController>(
        TokenController
      );
      const t = await controller.getToken({
        user: (null as unknown) as RequestContextUser,
      });
      expect(t).toEqual(mockToken);
    });
  });
});
