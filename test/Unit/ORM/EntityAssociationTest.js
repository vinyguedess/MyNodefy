const assert = require("chai").assert;

const mynodefy = require("./../../../index"),
  Connection = mynodefy.Connection,
  Repository = require("./../../../src/ORM/BaseRepository"),
  User = require("./../../DataProvider/Entity/User"),
  Job = require("./../../DataProvider/Entity/Job");

describe("Getting Entity with associated data", () => {
  before(done => {
    Connection.define(
      process.env.MYSQL_HOST || "127.0.0.1",
      process.env.MYSQL_USER || "root",
      process.env.MYSQL_PASS || "",
      process.env.MYSQL_DBASE || "mynodefy"
    );

    Connection.create("joblessly", {
      id: {
        type: "integer",
        key: "primary",
        null: false
      },
      name: { type: "varchar", size: 100, null: false }
    }).then(() => {
      return Connection.query(
        "INSERT INTO joblessly(name) VALUES" +
          '("Engineer"),("Accountant"),("Lawyer");'
      ).then(() => {
        Connection.create("users", {
          id: {
            type: "integer",
            key: "primary",
            null: false
          },
          name: { type: "varchar", size: 100, null: false },
          login: { type: "varchar", size: 20, null: false },
          password: { type: "varchar", size: 32, null: false },
          job_id: { type: "integer", null: true }
        }).then(() => {
          return Connection.query(
            "INSERT INTO users(name,login,password, job_id) VALUES" +
              '("Malala","mideast.girl","mal@midgirl", 1),' +
              '("Kate Perry","katep.rincess","princesskate", 3),' +
              '("Kurt Russel","hollywoodsucks","krussel", 1),' +
              '("George Clooney","mr.george","cloonatic", NULL);'
          ).then(() => done());
        });
      });
    });
  });

  describe("belongsTo", () => {
    it("Should get user job", done => {
      new Repository(User).find().by("id", 2).first().then(user => {
        user.job().then(job => {
          assert.equal("Lawyer", job.name);

          done();
        });
      });
    });

    it("Should return null in case looking for a data not found", done => {
      new Repository(User).find().by("id", 4).first().then(user => {
        user.job().then(job => {
          assert.isNull(job);

          done();
        });
      });
    });
  });

  describe("hasMany", () => {
    it("Should get a list of jobs", done => {
      new Repository(Job).find().by("id", 1).first().then(job => {
        job.users().then(users => {
          assert.equal(2, users.length);

          done();
        });
      });
    });
  });

  describe("Trying to trigger some errors", () => {
    it("Should throw error about misconfigured relations", done => {
      new Repository(Job).find().by("id", 1).first().then(job => {
        assert.throw(() => {
          job.levels();
        });

        assert.throw(() => {
          job.company();
        });

        done();
      });
    });
  });

  after(done => {
    Connection.drop("users").then(() => {
      Connection.drop("joblessly").then(() => done());
    });
  });
});
