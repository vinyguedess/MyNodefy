class Expression {
  eq(field, value) {
    return `${field} = ${this._treatValue(value)}`;
  }

  neq(field, value) {
    return `${field} <> ${this._treatValue(value)}`;
  }

  like(field, value) {
    return `${field} LIKE ${this._treatValue(value)}`;
  }

  gt(field, value) {
    return `${field} > ${this._treatValue(value)}`;
  }

  gte(field, value) {
    return `${field} >= ${this._treatValue(value)}`;
  }

  lt(field, value) {
    return `${field} < ${this._treatValue(value)}`;
  }

  lte(field, value) {
    return `${field} <= ${this._treatValue(value)}`;
  }

  isNull(field) {
    return `${field} IS NULL`;
  }

  isNotNull(field) {
    return `${field} IS NOT NULL`;
  }

  in(field, values) {
    return `${field} IN (${this._treatValue(values)})`;
  }

  notIn(field, values) {
    return `${field} NOT IN (${this._treatValue(values)})`;
  }

  between(field, first, last) {
    return `${field} BETWEEN ${this._treatValue(first)} AND ${this._treatValue(last)}`;
  }

  _treatValue(value) {
    if (Array.isArray(value))
      return value
        .map(value => {
          if (typeof value === "string") value = `"${value}"`;

          return value;
        })
        .join(",");

    if (typeof value === "string") return `"${value}"`;

    return value;
  }
}

module.exports = Expression;
