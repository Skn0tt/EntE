import { Test, TestingModule } from "@nestjs/testing";
import { EmailService } from "./email.service";
import { setupEnvVars } from "../../test/setup";

describe.only("EmailService", () => {
  let service: EmailService;
  beforeAll(async () => {
    setupEnvVars();
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();
    service = module.get<EmailService>(EmailService);
  });
  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
