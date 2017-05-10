const Entity = require("./../../../src/ORM/Entity");

class User extends Entity {
  rules() {
    return {
      id: {
        type: "integer",
        key: "primary"
      },
      name: {
        type: "varchar",
        max: 100,
        required: true
      },
      login: {
        type: "varchar",
        max: 20,
        required: true
      },
      password: {
        type: "varchar",
        max: 32,
        min: 6,
        required: true
      }
    };
  }

  relations() {
    return {
      job: {
        type: "belongsTo",
        field: "job_id",
        class: "test/DataProvider/Entity/Job",
        foreignKey: "id"
      }
    };
  }
}

module.exports = User;
