const fs = require("fs"),
  Connection = require("./../../DB/Connection"),
  SelectBuilder = require("./../Builder/SelectBuilder"),
  Expression = require("./../Builder/Query/Expression");

let appDir = process.cwd();

class Association {
  constructor() {
    this.conn = Connection;

    if (typeof this.get !== "function")
      throw new Error("Must implement get method for returning data");
  }

  set(key, value) {
    this[key] = value;

    return this;
  }

  getQueryBuilder() {
    return new SelectBuilder()
      .from(this.getClass().tableName())
      .where(new Expression().eq(this.foreignKey, this.entity.get(this.field)));
  }

  getClass() {
    return require(`${appDir}/${this.class}`);
  }

  isValid() {
    let requiredFields = ["field", "foreignKey", "class", "entity"];
    for (let key of requiredFields) {
      if (typeof this[key] === "undefined") return false;
    }

    if (!fs.existsSync(`${appDir}/${this.class}.js`)) return false;

    return true;
  }
}

module.exports = Association;
