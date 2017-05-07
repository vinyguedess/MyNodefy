let errors = {};
let fieldIsFilled = value =>
  typeof value !== "undefined" && value !== null && value !== "";
let isOverMinChars = (min, value) =>
  (typeof value === "number" && value >= min) ||
  (typeof value === "string" && value.length >= min);
let isUnderMaxChars = (max, value) =>
  (typeof value === "number" && value <= max) ||
  (typeof value === "string" && value.length <= max);

class EntityRules {
  static erase() {
    errors = {};
  }

  static getErrors() {
    return errors;
  }

  static addError(field, message) {
    if (typeof errors[field] === "undefined") errors[field] = [];

    errors[field].push(message);
  }

  static isValid() {
    return Object.keys(errors).length <= 0;
  }

  static validate(entity) {
    this.erase();

    if (typeof entity.rules === "undefined") return true;

    let rules = entity.rules();
    Object.keys(rules).forEach(field => {
      let fieldRule = rules[field];

      if (fieldRule.required && !fieldIsFilled(entity[field]))
        this.addError(field, "Is required");

      if (
        typeof fieldRule.min === "number" &&
        !isOverMinChars(fieldRule.max, entity[field])
      )
        this.addError(field, `Has less than ${fieldRule.min}`);

      if (
        typeof fieldRule.max === "number" &&
        !isUnderMaxChars(fieldRule.max, entity[field])
      )
        this.addError(field, `Has more than ${fieldRule.max}`);
    });

    return this;
  }
}

module.exports = EntityRules;
