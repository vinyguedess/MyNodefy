const FV = require("./../../../Validators/FieldValueValidator");

let twoWayFilterAttach = (filters, type) => {
  let filter = "(";
  filter += Object.keys(filters).map(k => filters[k]).join(` ${type} `);
  filter += ")";

  return filter;
};

class Expression {
  eq(field, value) {
    return `${field} = ${FV.validate(value)}`;
  }

  neq(field, value) {
    return `${field} <> ${FV.validate(value)}`;
  }

  like(field, value) {
    return `${field} LIKE ${FV.validate(value)}`;
  }

  gt(field, value) {
    return `${field} > ${FV.validate(value)}`;
  }

  gte(field, value) {
    return `${field} >= ${FV.validate(value)}`;
  }

  lt(field, value) {
    return `${field} < ${FV.validate(value)}`;
  }

  lte(field, value) {
    return `${field} <= ${FV.validate(value)}`;
  }

  isNull(field) {
    return `${field} IS NULL`;
  }

  isNotNull(field) {
    return `${field} IS NOT NULL`;
  }

  in(field, values) {
    return `${field} IN (${FV.validate(values)})`;
  }

  notIn(field, values) {
    return `${field} NOT IN (${FV.validate(values)})`;
  }

  between(field, first, last) {
    return `${field} BETWEEN ${FV.validate(first)} AND ${FV.validate(last)}`;
  }

  andX() {
    return twoWayFilterAttach(arguments, "AND");
  }

  orX() {
    return twoWayFilterAttach(arguments, "OR");
  }
}

module.exports = Expression;
