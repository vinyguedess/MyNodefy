const Connection = require("./../../index").Connection,
  SelectBuilder = require("./Builder/SelectBuilder"),
  InsertBuilder = require("./Builder/InsertBuilder");

let defaultEntity, tableName;
let entityHasMethod = (entity, tableName) =>
  typeof entity[tableName] !== "undefined";
let getConn = () => require("./../../index").Connection;
let getTableName = entity => {
  if (entityHasMethod(entity, "tableName")) return entity.tableName();

  let tableName = entity
    .toString()
    .substr(0, entity.toString().indexOf("{"))
    .split(" ")[1]
    .toLowerCase();

  return tableName + (tableName.substr(-1) === "s" ? "es" : "s");
};
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
    tableName = getTableName(defaultEntity);
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

  findAll(options) {
    if (typeof options === "undefined") options = {};

    let queryBuilder = new SelectBuilder(), expr = queryBuilder.expr();

    queryBuilder
      .from(tableName)
      .limit(options.limit || 100)
      .offset(options.offset || 0);

    return {
      all: () => {
        let query = queryBuilder.limit(null).offset(null).toSql();

        return Connection.query(query).then(response =>
          treatRawPacketToEntity(response)
        );
      },
      by: (field, value) => {
        let query = queryBuilder.where(expr.eq(field, value)).toSql();

        return Connection.query(query).then(response =>
          treatRawPacketToEntity(response)
        );
      }
    };
  }
}

module.exports = BaseRepository;
