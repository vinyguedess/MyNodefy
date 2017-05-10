const Entity = require("./../../../src/ORM/Entity");

class Job extends Entity {
  static tableName() {
    return "joblessly";
  }

  relations() {
    return {
      users: {
        type: "hasMany",
        field: "id",
        foreignKey: "job_id",
        class: "test/DataProvider/Entity/User"
      },
      levels: {
        type: "belongsTo"
      },
      company: {
        type: "hasMany",
        field: "id",
        foreignKey: "company_id",
        class: "test/DataProvider/Entity/Company"
      }
    };
  }
}

module.exports = Job;
