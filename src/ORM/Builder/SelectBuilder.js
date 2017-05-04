const Expression = require("./Expression");

class SelectBuilder {
  constructor() {
    this._expr = new Expression();

    this.select("*");
  }

  expr() {
    return this._expr;
  }

  select(fields) {
    this._fields = fields;

    return this;
  }

  from(from) {
    this._from = from;

    return this;
  }

  join() {
    if (!Array.isArray(this._joins)) this._joins = [];

    let join = {};
    if (arguments.length > 1) {
      join.type = arguments[0];
      join.table = arguments[1];
      join.field = arguments[2];
      join.other_field = arguments[3];
      if (typeof arguments[4] !== "undefined") join.from = arguments[4];
    }

    if (arguments.length === 1 && typeof arguments[0] === "object")
      join = arguments[0];

    ["table", "field", "other_field"].map(attr => {
      if (typeof join[attr] === "undefined")
        throw new Error("Your join must set info about " + attr);

      return attr;
    });

    this._joins.push(
      Object.assign(
        {
          type: "INNER",
          from: this._from
        },
        join
      )
    );

    return this;
  }

  where() {
    if (!Array.isArray(this._where)) this._where = [];

    this._where = this._where.concat(
      Object.keys(arguments).map(k => {
        return {
          filter: arguments[k],
          next: "AND"
        };
      })
    );

    return this;
  }

  orWhere() {
    if (!Array.isArray(this._where)) this._where = [];

    this._where = this._where.concat(
      Object.keys(arguments).map(k => {
        return {
          filter: arguments[k],
          next: "OR"
        };
      })
    );

    return this;
  }

  group() {
    if (!Array.isArray(this._group)) this._group = [];

    if (arguments.length === 1) {
      if (typeof arguments[0] === "string") this._group.push(arguments[0]);

      if (Array.isArray(arguments[0]))
        this._group = this._group.concat(arguments[0]);
    }

    if (arguments.length > 1)
      this._group = this._group.concat(
        Object.keys(arguments).map(key => arguments[key])
      );

    this._group = this._group.filter((element, index, self) => {
      return index === self.indexOf(element);
    });

    return this;
  }

  order(argsT) {
    if (!Array.isArray(this._order)) this._order = [];

    if (arguments.length === 1) this._order.push(arguments[0]);

    if (arguments.length === 2) {
      if (
        arguments[1].toLowerCase() !== "asc" &&
        arguments[1].toLowerCase() !== "desc"
      )
        throw new Error("Second argument must be ASC or DESC");

      this._order.push(Object.keys(arguments).map(key => arguments[key]));
    }

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

    if (Array.isArray(this._joins)) {
      this._joins.forEach(join => {
        query +=
          ` ${join.type} JOIN ${join.table} ` +
          `ON ${join.from}.${join.field} = ${join.table}.${join.other_field}`;
      });
    }

    if (Array.isArray(this._where)) {
      query += " WHERE";
      this._where.forEach((filter, index, all) => {
        if (index > 0) query += ` ${filter.next} ${filter.filter}`;
        else query += ` ${filter.filter}`;
      });
    }

    if (Array.isArray(this._group))
      query += " GROUP BY " + this._group.join(",");

    if (typeof this._order !== "undefined") {
      query +=
        " ORDER BY " +
        this._order
          .map(element => {
            if (Array.isArray(element)) return element.join(" ");

            return element;
          })
          .join(",");
    }

    if (typeof this._limit !== "undefined") query += ` LIMIT ${this._limit}`;

    if (typeof this._offset !== "undefined") query += ` OFFSET ${this._offset}`;

    return query + ";";
  }
}

module.exports = SelectBuilder;
