const Entity = require("./../../../src/ORM/Entity");

class Job extends Entity {
  static tableName() {
    return "joblessly";
  }
}

module.exports = Job;
