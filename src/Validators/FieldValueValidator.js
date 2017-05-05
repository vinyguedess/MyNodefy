class FieldValue {
  static validate(value) {
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

module.exports = FieldValue;
