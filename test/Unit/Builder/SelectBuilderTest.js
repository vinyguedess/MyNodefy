const assert = require("chai").assert;

const SelectBuilder = require("./../../../src/ORM/Builder/SelectBuilder");

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

  describe("Writing query filters", () => {
    let expr = new SelectBuilder().expr();

    it("Should make a simple where", () => {
      assert.equal(
        "SELECT * FROM table_name WHERE id = 10;",
        new SelectBuilder().from("table_name").where(expr.eq("id", 10)).toSql()
      );

      assert.equal(
        "SELECT * FROM table_name WHERE id <> 10;",
        new SelectBuilder().from("table_name").where(expr.neq("id", 10)).toSql()
      );

      assert.equal(
        "SELECT * FROM table_name WHERE id IS NOT NULL;",
        new SelectBuilder()
          .from("table_name")
          .where(expr.isNotNull("id"))
          .toSql()
      );
    });

    it("Should make not too much complex wheres", () => {
      assert.equal(
        'SELECT * FROM table_name WHERE id IN (10,20) AND nome LIKE "%test%";',
        new SelectBuilder()
          .from("table_name")
          .where(expr.in("id", [10, 20]), expr.like("nome", "%test%"))
          .toSql()
      );

      assert.equal(
        "SELECT * FROM table_name WHERE id NOT IN (1,2,3) OR status IS NULL;",
        new SelectBuilder()
          .from("table_name")
          .where(expr.notIn("id", [1, 2, 3]))
          .orWhere(expr.isNull("status"))
          .toSql()
      );

      assert.equal(
        "SELECT * FROM table_name WHERE num BETWEEN 1 AND 20 OR num > 100;",
        new SelectBuilder()
          .from("table_name")
          .where(expr.between("num", 1, 20))
          .orWhere(expr.gt("num", 100))
          .toSql()
      );
    });

    it("Should make advanced filters and more complex querying", () => {
      assert.equal(
        "SELECT * FROM table_name WHERE id >= 1 AND (value < 100 AND amount <= 10);",
        new SelectBuilder()
          .from("table_name")
          .where(expr.gte("id", 1))
          .where(expr.andX(expr.lt("value", 100), expr.lte("amount", 10)))
          .toSql()
      );

      assert.equal(
        "SELECT * FROM table_name WHERE value < 100 AND " +
          "(amount > 10 AND (visitor = 2 OR visitor = 2.5));",
        new SelectBuilder()
          .from("table_name")
          .where(expr.lt("value", 100))
          .where(
            expr.andX(
              expr.gt("amount", 10),
              expr.orX(expr.eq("visitor", 2), expr.eq("visitor", 2.5))
            )
          )
          .toSql()
      );
    });
  });

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
