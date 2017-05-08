const assert = require("chai").assert;

const Connection = require("./../../../index").Connection,
  User = require("./../../DataProvider/Entity/User"),
  UserRepository = require("./../../DataProvider/Repository/UserRepository");

describe("RepositoryTest", () => {
  before(done => {
    Connection.define(
      process.env.MYSQL_HOST || "127.0.0.1",
      process.env.MYSQL_USER || "root",
      process.env.MYSQL_PASS || "",
      process.env.MYSQL_DBASE || "mynodefy"
    );

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
    }).then(() => {
      return Connection.query(
        "INSERT INTO users(name,login,password, age) VALUES" +
          '("Malala","mideast.girl","mal@midgirl", NULL),' +
          '("Kate Perry","katep.rincess","princesskate", NULL),' +
          '("Kurt Russel","hollywoodsucks","krussel", NULL),' +
          '("George Clooney","mr.george","cloonatic", NULL);'
      ).then(() => done());
    });
  });

  describe("Repository returning entity", () => {
    let ur = new UserRepository(User);

    it("Should get a list of data inserted before", done => {
      ur.find().all().then(collection => {
        assert.equal(4, collection.length);
        assert.equal(collection[3].name, "George Clooney");

        done();
      });
    });

    it("Should get a paginated data", done => {
      ur.find({ limit: 3, offset: 3 }).get().then(collection => {
        assert.equal(1, collection.length);

        done();
      });
    });

    it("Should get a list of filtered data", done => {
      ur.find().by("name", "Malala").all().then(collection => {
        assert.instanceOf(collection[0], User);

        done();
      });
    });

    it("Should get only one entity", done => {
      ur.find().by("id", 3).first().then(user => {
        assert.instanceOf(user, User);
        assert.equal(user.get("name"), "Kurt Russel");

        done();
      });
    });

    it("Should return null when not found entity", done => {
      ur.find().by("id", 100).first().then(user => {
        assert.isNull(user);

        done();
      });
    });
  });

  describe("Repository saving data", () => {
    let ur = new UserRepository(User);
    it("Should insert data", done => {
      let u = new User();
      u.set({
        name: "Daiana dos Santos",
        login: "d.santos",
        password: "dai@san"
      });

      ur.save(u).then(response => {
        assert.isNumber(u.id);
        assert.equal(5, u.id);
        assert.isTrue(response);

        done();
      });
    });

    it("Should update found data", done => {
      ur.find().by("id", 5).first().then(user => {
        ur.save(user).then(response => {
          assert.isTrue(response);

          done();
        });
      });
    });
  });

  after(done => {
    Connection.drop("users").then(() => done());
  });
});
