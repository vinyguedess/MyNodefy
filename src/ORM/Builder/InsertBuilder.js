const SavingBuilder = require("./SavingBuilder");

class InsertBuilder extends SavingBuilder {
  toSql() {
    if (typeof this._table === "undefined")
      throw new Error("Must define table for insert");

    if (typeof this._fields === "undefined" || this._fields.length <= 0)
      throw new Error(
        "Must define at least one attribute and value for insert"
      );

    let fields = [], values = [];
    this._fields.forEach(item => {
      fields.push(item.name);
      values.push(item.value);
    });

    let query = `INSERT INTO ${this._table} `;
    query += `(${fields.join(",")}) `;
    query += `VALUES (${values})`;

    return query + ";";
  }
}

module.exports = InsertBuilder;
