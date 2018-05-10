import { ClientFunction } from "testcafe";
import * as config from "../e2eConfig";

const { baseUrl } = config.get();

fixture("Login Form").page(baseUrl);

const USERNAME = "admin";
const PASSWORD = "root";
test("Login", async t => {
  await t
    .typeText("#name", USERNAME)
    .typeText("#password", PASSWORD)
    .pressKey("enter");

  const getPathname = ClientFunction(() => document.location.pathname);
  await t.expect(getPathname()).contains("/entries");
});
