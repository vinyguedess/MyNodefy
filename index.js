const Connection = require("./src/DB/Connection"),
  Repository = require("./src/ORM/BaseRepository"),
  Entity = require("./src/ORM/Entity");

module.exports = {
  Connection: Connection,
  ORM: {
    Repository: Repository,
    Entity: Entity
  }
};
