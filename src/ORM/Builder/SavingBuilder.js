const Builder = require("./Builder"),
  FV = require("./../../Validators/FieldValueValidator");

class SavingBuilder extends Builder {
  constructor(table) {
    super();

    this._table = table;
  }

  set(field, value) {
    if (!Array.isArray(this._fields)) this._fields = [];

    if (typeof field === "object") {
      for (let key in field)
        this.set(key, field[key]);

      return this;
    }

    this._fields.push({
      name: field,
      value: FV.validate(value)
    });

    return this;
  }
}

module.exports = SavingBuilder;
