import { test } from "qunit";
import moduleForAcceptance from "frontend/tests/helpers/module-for-acceptance";
import { authenticateSession } from "frontend/tests/helpers/ember-simple-auth";
import page from "frontend/tests/pages/skills-index";

moduleForAcceptance("Acceptance | create skill", {
  beforeEach() {
    authenticateSession(this.application, {
      ldap_uid: "development_user",
      token: "1234"
    });
  }
});

test("creating a new skill", async function(assert) {
  assert.expect(3);

  await page.indexPage.visit();
  assert.equal(currentURL(), "/skills");
  let names_before = page.indexPage.skills.skillNames
    .toArray()
    .map(name => name.text);
  assert.notOk(names_before.includes("• RVM"));

  await page.indexPage.openModalButton();
  await page.indexPage.title("RVM");
  /* eslint "no-undef": "off" */
  await selectChoose("#skill-new-category", ".ember-power-select-option", 1);
  await selectChoose("#skill-new-radar", ".ember-power-select-option", 2);
  await selectChoose("#skill-new-portfolio", ".ember-power-select-option", 1);
  await page.indexPage.newSkillSubmitButton();

  let names = page.indexPage.skills.skillNames.toArray().map(name => name.text);
  assert.ok(names.includes("• RVM"));
});
