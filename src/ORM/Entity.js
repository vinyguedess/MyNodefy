let mode, isNewRecord, currentAttributes = {};

class Entity {
  constructor(entityMode) {
    mode = entityMode;

    isNewRecord = mode === "found" ? false : true;
  }

  static tableName() {
    let tableName = this.toString()
      .substr(0, this.toString().indexOf("{"))
      .split(" ")[1]
      .toLowerCase();

    return tableName + (tableName.substr(-1) === "s" ? "es" : "s");
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
