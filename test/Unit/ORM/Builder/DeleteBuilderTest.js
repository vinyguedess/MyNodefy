const assert = require("chai").assert;

const DeleteBuilder = require("./../../../../src/ORM/Builder/DeleteBuilder");

describe("DeleteBuilderTest", () => {
  describe("Writing simple deletes", () => {
    it("Should make simple deletes", () => {
      assert.equal(
        "DELETE FROM table_name;",
        new DeleteBuilder("table_name").toSql()
      );
    });
  });

  describe("Writing more complex deletes", () => {
    let expr = new DeleteBuilder().expr();

    it("Should make an advanced query for deleting", () => {
      assert.equal(
        "DELETE FROM table_name " +
          "WHERE status = 0 AND (checked = 0 OR checked IS NULL);",
        new DeleteBuilder("table_name")
          .where(expr.eq("status", 0))
          .where(expr.orX(expr.eq("checked", 0), expr.isNull("checked")))
          .toSql()
      );
    });
  });

  describe("Catching possible errors", () => {
    it("Should throw error on lacking information", () => {
      assert.throw(() => new DeleteBuilder().toSql());
    });
  });
});
