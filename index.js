const Connection = require("./src/DB/Connection"),
  Repository = require("./src/ORM/BaseRepository"),
  Entity = require("./src/ORM/Entity"),
  Expression = require("./src/ORM/Builder/Query/Expression");

module.exports = {
  Connection: Connection,
  ORM: {
    Repository: Repository,
    Entity: Entity,
    Query: {
      Expression: Expression
    }
  }
};
