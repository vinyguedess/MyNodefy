class SelectBuilder {
  constructor() {
    this.select("*");
  }

  select(fields) {
    this._fields = fields;

    return this;
  }

  from(from) {
    this._from = from;

    return this;
  }

  group() {
    if (!Array.isArray(this._group)) this._group = [];

    if (arguments.length === 1) {
      if (typeof arguments[0] === "string") this._group.push(arguments[0]);

      if (Array.isArray(arguments[0]))
        this._group = this._group.concat(arguments[0]);
    }

    if (arguments.length > 1) {
      for (let item of arguments)
        this._group.push(item);
    }

    this._group = this._group.filter((element, index, self) => {
      return index === self.indexOf(element);
    });

    return this;
  }

  limit(limit) {
    if (typeof limit !== "number")
      throw new Error("Query limit must be a number");

    this._limit = limit;

    return this;
  }

  offset(offset) {
    if (typeof offset !== "number")
      throw new Error("Query offset must be a number");

    this._offset = offset;

    return this;
  }

  toSql() {
    if (typeof this._fields === "undefined")
      throw new Error("You must define which fields you wanna select");

    if (typeof this._from === "undefined")
      throw new Error(
        "If you don't say where I must get the data I don't work"
      );

    let query = `SELECT ${this._fields} FROM ${this._from}`;

    console.log(this._group);
    if (Array.isArray(this._group))
      query += " GROUP BY " + this._group.join(",");

    if (typeof this._limit !== "undefined") query += ` LIMIT ${this._limit}`;

    if (typeof this._offset !== "undefined") query += ` OFFSET ${this._offset}`;

    return query + ";";
  }
}

module.exports = SelectBuilder;
