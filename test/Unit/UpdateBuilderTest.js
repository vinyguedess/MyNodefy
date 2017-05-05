const assert = require("chai").assert;

const UpdateBuilder = require("./../../src/ORM/Builder/UpdateBuilder");

describe("UpdateBuilderTest", () => {
  describe("Making simple updates", () => {
    it("Should update writing code the old way", () => {
      assert.equal(
        'UPDATE table_name SET name="Angelina Jolie",profession="Actress";',
        new UpdateBuilder("table_name")
          .set("name", "Angelina Jolie")
          .set("profession", "Actress")
          .toSql()
      );
    });

    it("Should update sending all fields at once", () => {
      assert.equal(
        "UPDATE table_name " +
          'SET name="Shaquille O\'Neal",profession="Basketballer";',
        new UpdateBuilder("table_name")
          .set({
            name: "Shaquille O'Neal",
            profession: "Basketballer"
          })
          .toSql()
      );
    });
  });

  describe("Filtered Updates", () => {
    let expr = new UpdateBuilder().expr();

    it("Should update making filters", () => {
      assert.equal(
        "UPDATE table_name SET extracted=true " +
          "WHERE (extracted = false OR extracted IS NULL) AND status <> 0;",
        new UpdateBuilder("table_name")
          .set("extracted", true)
          .where(
            expr.orX(expr.eq("extracted", false), expr.isNull("extracted"))
          )
          .where(expr.neq("status", 0))
          .toSql()
      );
    });
  });

  describe("Catching some errors", () => {
    it("Should break when missing some data", () => {
      assert.throw(() => {
        new UpdateBuilder().toSql();
      }, "You must define table before update");

      assert.throw(() => {
        new UpdateBuilder("table_name").toSql();
      }, "You must define at least one field for update");
    });
  });
});
