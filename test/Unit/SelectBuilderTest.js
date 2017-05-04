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

  describe("Writing queries that join results", () => {
    it("Should make simple joins", () => {
      assert.equal(
        "SELECT * FROM table_name" +
          " INNER JOIN another_table ON table_name.fk_id = another_table.id;",
        new SelectBuilder()
          .from("table_name")
          .join({
            type: "INNER",
            table: "another_table",
            field: "fk_id",
            other_field: "id"
          })
          .toSql()
      );

      assert.equal(
        "SELECT * FROM table_name" +
          " INNER JOIN another_table ON table_name.fk_id = another_table.id" +
          " LEFT JOIN third_table ON other_table.id = third_table.fk_id;",
        new SelectBuilder()
          .from("table_name")
          .join({
            table: "another_table",
            field: "fk_id",
            other_field: "id"
          })
          .join({
            type: "LEFT",
            from: "other_table",
            table: "third_table",
            field: "id",
            other_field: "fk_id"
          })
          .toSql()
      );
    });

    it("Should still make simple joins in a different way", () => {
      assert.equal(
        "SELECT * FROM table_name" +
          " INNER JOIN another_table ON table_name.fk_id = another_table.id;",
        new SelectBuilder()
          .from("table_name")
          .join("INNER", "another_table", "fk_id", "id")
          .toSql()
      );

      assert.equal(
        "SELECT * FROM table_name" +
          " INNER JOIN another_table ON table_name.fk_id = another_table.id" +
          " LEFT JOIN third_table ON other_table.id = third_table.fk_id;",
        new SelectBuilder()
          .from("table_name")
          .join("INNER", "another_table", "fk_id", "id")
          .join("LEFT", "third_table", "id", "fk_id", "other_table")
          .toSql()
      );
    });

    it("Should validate if you wrote a join correctly", () => {
      assert.throw(() => {
        new SelectBuilder()
          .from("table_name")
          .join({
            type: "INNER"
          })
          .toSql();
      });
    });
  });

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

  describe("Ordering results", () => {
    it("Should simply order results", () => {
      assert.equal(
        "SELECT * FROM table_name ORDER BY id;",
        new SelectBuilder().from("table_name").order("id").toSql()
      );

      assert.equal(
        "SELECT * FROM table_name ORDER BY created_at,id;",
        new SelectBuilder()
          .from("table_name")
          .order("created_at")
          .order("id")
          .toSql()
      );
    });

    it("Should order declaring if ascending or descending", () => {
      assert.equal(
        "SELECT * FROM table_name ORDER BY id DESC;",
        new SelectBuilder().from("table_name").order("id", "DESC").toSql()
      );

      assert.equal(
        "SELECT * FROM table_name ORDER BY created_at DESC,value ASC,id;",
        new SelectBuilder()
          .from("table_name")
          .order("created_at", "DESC")
          .order("value", "ASC")
          .order("id")
          .toSql()
      );
    });

    it("Should validate errors", () => {
      assert.throw(() => {
        new SelectBuilder().from("table_name").order("id", "SORT").getSql();
      });
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
