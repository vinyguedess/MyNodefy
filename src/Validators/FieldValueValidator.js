class FieldValue {
  static validate(value) {
    if (Array.isArray(value))
      return value
        .map(value => {
          return this.validate(value);
        })
        .join(",");

    if (typeof value === "string") return `"${value}"`;

    return value;
  }
}

module.exports = FieldValue;
