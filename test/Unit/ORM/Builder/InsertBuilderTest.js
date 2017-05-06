const assert = require("chai").assert;

const InsertBuilder = require("./../../../../src/ORM/Builder/InsertBuilder");

describe("InsertBuilderTest", () => {
  describe("Writing simple inserts", () => {
    it("Should do a classical insert", () => {
      assert.equal(
        "INSERT INTO table_name (name,profession,active) " +
          'VALUES ("Orlando Bloom","Actor",true);',
        new InsertBuilder("table_name")
          .set("name", "Orlando Bloom")
          .set("profession", "Actor")
          .set("active", true)
          .toSql()
      );
    });

    it("Should run a query defining all attributes at one", () => {
      assert.equal(
        "INSERT INTO table_name (name,profession,active) " +
          'VALUES ("Maria Sharapova","Tenist",true);',
        new InsertBuilder("table_name")
          .set({
            name: "Maria Sharapova",
            profession: "Tenist",
            active: true
          })
          .toSql()
      );
    });

    it("Should throw an error", () => {
      assert.throw(() => {
        new InsertBuilder().toSql();
      }, "Must define table for insert");

      assert.throw(() => {
        new InsertBuilder("table_name").toSql();
      }, "Must define at least one attribute and value for insert");
    });
  });
});
