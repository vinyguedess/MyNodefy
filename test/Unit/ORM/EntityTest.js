const assert = require("chai").assert;

const ER = require("./../../../src/Validators/EntityRules"),
  User = require("./../../DataProvider/Entity/User");

describe("EntityTest", () => {
  describe("Manipulating attributes", () => {
    it("Should set and get Entity's attributes", () => {
      let u = new User();

      u.set("name", "Neymar Jr.");
      u.set({
        job: "Soccer Player",
        active: true
      });
      u.age = 25;

      assert.equal("Neymar Jr.", u.name);
      assert.equal("Soccer Player", u.get("job"));
      assert.isAtLeast(u.age, 25);
      assert.isTrue(u.get("active"));
    });
  });

  describe("Validating an Entity", () => {
    it("Should validate required fields", () => {
      let u = new User();
      u.set({
        name: "Sandra Bullock",
        login: "sandra.bullock1973-123710923802193809128l13nl4n3lk4nkl23n4l23",
        password: "!sandra@bullock"
      });
      assert.isFalse(ER.validate(u).isValid());

      u.login = "sandra.bullock@";
      assert.isTrue(ER.validate(u).isValid());
    });
  });
});
