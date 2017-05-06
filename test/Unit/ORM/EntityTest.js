const assert = require("chai").assert;

const User = require("./../../DataProvider/Entity/User");

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
});
