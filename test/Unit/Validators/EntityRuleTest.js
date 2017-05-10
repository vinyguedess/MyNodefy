const assert = require("chai").assert;

const ER = require("./../../../src/Validators/EntityRules"),
  Job = require("./../../DataProvider/Entity/Job"),
  Numeral = require("./../../DataProvider/Entity/Numeral");

describe("EntityRuleTest", () => {
  describe("It Should validate numbers", () => {
    it("Should validate min and max by number and not string length", () => {
      let numeral = new Numeral();
      assert.isFalse(ER.validate(numeral).isValid());

      numeral.number = 2;
      numeral.other_number = 99;
      assert.isTrue(ER.validate(numeral).isValid());
    });
  });

  describe("Validating entities without rules determined", () => {
    it("Should return true", () => {
      assert.isTrue(ER.validate(new Job()).isValid());
    });
  });
});
