import { ClientFunction } from "testcafe";

fixture("Login Form").page("http://localhost:80");

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
