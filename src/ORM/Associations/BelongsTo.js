const Association = require("./Association");

let cached = {
  lastRefreshed: null,
  data: null
};

class BelongsTo extends Association {
  get() {
    if (!this.isValid()) throw new Error("Relation misconfigured");

    let query = this.getQueryBuilder().limit(1).toSql();

    return this.conn.query(query).then(collection => {
      if (collection.length < 1) return null;

      return collection[0];
    });
  }
}

module.exports = BelongsTo;
