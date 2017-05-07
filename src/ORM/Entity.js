let isNewRecord;

class Entity {
  constructor() {
    isNewRecord = true;
  }

  get(key) {
    if (typeof key === "undefined") {
      let attributes = {};
      Object.keys(this).forEach(key => {
        if (typeof this[key] !== "function") attributes[key] = this[key];
      });

      return attributes;
    }

    return this[key];
  }

  set(key, value) {
    if (typeof key === "object") {
      Object.keys(key).map(k => {
        this.set(k, key[k]);
      });
      return;
    }

    if (key === this.getPk()) isNewRecord = false;

    this[key] = value;
  }

  getPk() {
    if (typeof this.rules === "undefined") return "id";

    let rules = this.rules(), pk = "id";
    Object.keys(rules).forEach(field => {
      if (
        typeof rules[field].key !== "undefined" &&
        rules[field].key === "primary"
      )
        pk = field;
    });

    return pk;
  }

  isNewRecord() {
    return isNewRecord;
  }
}

module.exports = Entity;
