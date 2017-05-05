const Expression = require("./Query/Expression");

class Builder {
  constructor() {
    this._expr = new Expression();
  }

  expr() {
    return this._expr;
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
}

module.exports = Builder;
