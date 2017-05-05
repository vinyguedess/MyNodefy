const SavingBuilder = require("./SavingBuilder");

class DeleteBuilder extends SavingBuilder {
  toSql() {
    if (typeof this._table === "undefined")
      throw new Error("You must define a table before deleting something");

    let query = `DELETE FROM ${this._table}`;

    if (Array.isArray(this._where)) {
      query += " WHERE";
      this._where.forEach((filter, index, all) => {
        if (index > 0) query += ` ${filter.next} ${filter.filter}`;
        else query += ` ${filter.filter}`;
      });
    }

    return query + ";";
  }
}

module.exports = DeleteBuilder;
