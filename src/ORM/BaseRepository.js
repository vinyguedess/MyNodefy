const Connection = require("./../../index").Connection,
  SelectBuilder = require("./Builder/SelectBuilder"),
  InsertBuilder = require("./Builder/InsertBuilder");

let defaultEntity, tableName;
let treatRawPacketToEntity = response => {
  return response.map(element => {
    let e = new defaultEntity();
    e.set(element);

    return e;
  });
};

class BaseRepository {
  constructor(entity) {
    defaultEntity = entity;
    tableName = entity.tableName();
  }

  save(entity) {
    if (entity.isNewRecord()) return this.insert(entity);

    return this.update(entity);
  }

  insert(entity) {
    let attributes = entity.get();

    let queryBuilder = new InsertBuilder(tableName).set(entity.get());

    return Connection.query(queryBuilder.toSql()).then(response => {
      if (response.insertId > 0) {
        entity[entity.getPk()] = response.insertId;
        return true;
      }

      return false;
    });
  }

  update(entity) {}

  find(options) {
    if (typeof options === "undefined") options = {};

    let queryBuilder = new SelectBuilder(), expr = queryBuilder.expr();

    queryBuilder
      .from(tableName)
      .limit(options.limit || 100)
      .offset(options.offset || 0);

    let finder = {
      by: (field, value) => {
        queryBuilder.where(expr.eq(field, value));

        return finder;
      },

      all: () => {
        let query = queryBuilder.limit(null).offset(null).toSql();

        return Connection.query(query).then(response =>
          treatRawPacketToEntity(response)
        );
      },
      get: () =>
        Connection.query(queryBuilder.getSql()).then(response =>
          treatRawPacketToEntity(response)
        ),
      first: () =>
        Connection.query(queryBuilder.toSql()).then(response => {
          response = treatRawPacketToEntity(response);
          if (response.length > 0) return response[0];

          return null;
        })
    };

    return finder;
  }
}

module.exports = BaseRepository;
