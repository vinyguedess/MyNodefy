const SavingBuilder = require("./SavingBuilder");

class UpdateBuilder extends SavingBuilder {
  toSql() {
    if (typeof this._table === "undefined")
      throw new Error("You must define table before update");

    if (typeof this._fields === "undefined" || this._fields.length <= 0)
      throw new Error("You must define at least one field for update");

    let query = `UPDATE ${this._table}`;

    let fields = [];
    this._fields.forEach(item => fields.push(`${item.name}=${item.value}`));
    query += ` SET ${fields.join(",")}`;

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

module.exports = UpdateBuilder;
