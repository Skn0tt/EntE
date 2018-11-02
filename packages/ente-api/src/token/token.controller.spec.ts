import { Test, TestingModule } from "@nestjs/testing";
import { TokenController } from "./token.controller";
import { setupEnvVars } from "../../test/setup";
import { TokenService } from "./token.service";

const mockToken = "token";

const tokenServiceMock: TokenService = {
  async createToken(u) {
    return mockToken;
  }
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
          useValue: tokenServiceMock
        }
      ]
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
      const t = await controller.getToken({ user: null });
      expect(t).toEqual(mockToken);
    });
  });
});
