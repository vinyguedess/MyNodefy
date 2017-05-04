const assert = require("chai").assert;

const SelectBuilder = require("./../../src/ORM/Builder/SelectBuilder");

describe("SelectBuilderTest", () => {
  describe("Making simple queries", () => {
    it("Should return a simple select query", () => {
      let sb = new SelectBuilder();

      assert.equal("SELECT * FROM table_name;", sb.from("table_name").toSql());
    });

    it("Should validate that query has required informations", () => {
      let sb = new SelectBuilder();

      assert.throw(() => {
        sb.select().toSql();
      });

      assert.throw(() => {
        sb.select("*").from().toSql();
      });
    });
  });

  describe("Writing queries that join results", () => {});

  describe("Writing simple filters", () => {});

  describe("Grouping results", () => {
    it("Should simply group results", () => {
      assert.equal(
        "SELECT * FROM table_name GROUP BY amount;",
        new SelectBuilder().from("table_name").group("amount").toSql()
      );
    });

    it("Should simply group more that one field", () => {
      assert.equal(
        "SELECT * FROM table_name GROUP BY date,amount;",
        new SelectBuilder().from("table_name").group(["date", "amount"]).toSql()
      );

      assert.equal(
        "SELECT * FROM table_name GROUP BY date,amount;",
        new SelectBuilder().from("table_name").group("date", "amount").toSql()
      );
    });
  });

  describe("Limiting query data to be returned", () => {
    it("Should limit query", () => {
      assert.equal(
        "SELECT * FROM table_name LIMIT 100;",
        new SelectBuilder().from("table_name").limit(100).toSql()
      );
    });

    it("Should offset query", () => {
      assert.equal(
        "SELECT * FROM table_name OFFSET 20;",
        new SelectBuilder().from("table_name").offset(20).toSql()
      );
    });

    it("Should limit AND offset query", () => {
      assert.equal(
        "SELECT * FROM table_name LIMIT 10 OFFSET 30;",
        new SelectBuilder().from("table_name").limit(10).offset(30).toSql()
      );
    });

    it("Should validate errors", () => {
      assert.throw(() => {
        new SelectBuilder().from("table_name").limit("10").toSql();
      });

      assert.throw(() => {
        new SelectBuilder().from("table_name").offset("20").toSql();
      });
    });
  });
});
