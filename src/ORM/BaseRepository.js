const Connection = require("./../../index").Connection,
  SelectBuilder = require("./Builder/SelectBuilder"),
  InsertBuilder = require("./Builder/InsertBuilder"),
  UpdateBuilder = require("./Builder/UpdateBuilder"),
  DeleteBuilder = require("./Builder/DeleteBuilder");

let defaultEntity, tableName;
let treatRawPacketToEntity = response => {
  return response.map(element => {
    let e = new defaultEntity("found");
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

    let query = new InsertBuilder(tableName).set(attributes).toSql();

    return Connection.query(query).then(response => {
      if (response.insertId > 0) entity[entity.getPk()] = response.insertId;

      return response.insertId > 0;
    });
  }

  update(entity) {
    let attributes = entity.get();
    delete attributes[entity.getPk()];

    let queryBuilder = new UpdateBuilder(tableName),
      expr = queryBuilder.expr(),
      query = queryBuilder
        .set(attributes)
        .where(expr.eq(entity.getPk(), entity.get(entity.getPk())))
        .toSql();

    return Connection.query(query).then(response => {
      return response.affectedRows === 1;
    });
  }

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
      where: {
        and: w => {
          queryBuilder.where(w);

          return finder;
        },
        or: w => {
          queryBuilder.orWhere(w);

          return finder;
        }
      },

      count: () => {
        let query = queryBuilder.select("COUNT(*) `total`").toSql();

        return Connection.query(query).then(response => {
          return response[0].total;
        });
      },
      all: () => {
        let query = queryBuilder.limit(null).offset(null).toSql();

        return Connection.query(query).then(response =>
          treatRawPacketToEntity(response)
        );
      },
      get: () =>
        Connection.query(queryBuilder.toSql()).then(response =>
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

  delete(item) {
    if (Array.isArray(item))
      return item.map(i => {
        return this.delete(i);
      });

    let key = "id";
    if (typeof item === "object") {
      key = item.getPk();
      item = item.get(key);
    }

    let queryBuilder = new DeleteBuilder(tableName),
      expr = queryBuilder.expr(),
      query = queryBuilder.where(expr.eq(key, item)).toSql();

    return Connection.query(query).then(response => {
      return response.serverStatus === 2;
    });
  }
}

module.exports = BaseRepository;
