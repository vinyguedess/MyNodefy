const assert = require("chai").assert;

const Connection = require("./../../../src/DB/Connection"),
  InsertBuilder = require("./../../../src/ORM/Builder/InsertBuilder"),
  SelectBuilder = require("./../../../src/ORM/Builder/SelectBuilder");

describe("ConnectionTest", () => {
  before(() => {
    Connection.define("127.0.0.1", "root", "", "mynodefy");
  });

  describe("Creating tables", () => {
    it("Should create a table so we can run other tests", done => {
      Connection.create("users", {
        id: {
          type: "integer",
          key: "primary",
          null: false
        },
        name: { type: "varchar", size: 100, null: false },
        login: { type: "varchar", size: 20, null: false },
        password: { type: "varchar", size: 32, null: false },
        age: { type: "integer" }
      }).then(response => {
        assert.equal(2, response.serverStatus);

        done();
      });
    });
  });

  describe("Executing queries", () => {
    it("Should asynchronously insert data", done => {
      let query = new InsertBuilder("users")
        .set("name", "Vinicius Guedes")
        .set("login", "vinyguedess")
        .set("password", "pass@123")
        .toSql();

      Connection.query(query).then(response => {
        assert.equal(1, response.affectedRows);
        assert.isNumber(response.insertId);
        assert.isAtLeast(response.insertId, 1);

        done();
      });
    });

    it("Should select data inserted before", done => {
      let query = new SelectBuilder().from("users").toSql();

      Connection.query(query).then(response => {
        assert.isAtLeast(response.length, 1);
        assert.equal("Vinicius Guedes", response[0].name);
        assert.equal("vinyguedess", response[0].login);

        done();
      });
    });

    it("Should generate errors", done => {
      let query = new SelectBuilder().from("users_").toSql();

      Connection.query(query).catch(err => {
        assert.equal(err.code, "ER_NO_SUCH_TABLE");

        done();
      });
    });
  });

  describe("Dropping tables", () => {
    it("Should drop tables created by this test", done => {
      let query = "DROP TABLE users;";

      Connection.drop("users").then(response => {
        assert.equal(2, response.serverStatus);

        done();
      });
    });
  });
});
