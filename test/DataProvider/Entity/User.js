const Entity = require("./../../../src/ORM/Entity");

class User extends Entity {
  rules() {
    return {
      id: {
        type: "integer"
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
        required: true
      }
    };
  }
}

module.exports = User;
