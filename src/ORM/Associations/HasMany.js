const Association = require("./Association");

let cached = {
  lastRefreshed: null,
  data: null
};

class HasMany extends Association {
  get() {
    if (!this.isValid()) throw new Exception("Relation misconfigured");

    let query = this.getQueryBuilder().toSql();

    return this.conn.query(query).then(collection => {
      return collection;
    });
  }
}

module.exports = HasMany;
