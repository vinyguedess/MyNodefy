const BelongsTo = require("./Associations/BelongsTo"),
  HasMany = require("./Associations/HasMany");

let RawPacketToEntity = (response, defaultEntity) => {
  if (Array.isArray(response))
    return response.map(element => {
      return RawPacketToEntity(element, defaultEntity);
    });

  let e = new defaultEntity("found");
  e.set(response);

  if (typeof e.relations === "function") {
    let relations = e.relations();
    Object.keys(relations).forEach(relation => {
      let association = null;
      if (relations[relation].type.toLowerCase() === "belongsto")
        association = new BelongsTo();
      else if (relations[relation].type.toLowerCase() === "hasmany")
        association = new HasMany();

      if (association !== null)
        e[relation] = () => {
          association.set("field", relations[relation].field);
          association.set("foreignKey", relations[relation].foreignKey);
          association.set("class", relations[relation].class);
          association.set("entity", e);

          return association.get().then(collection => {
            if (collection === null) return null;

            return RawPacketToEntity(collection, association.getClass());
          });
        };
    });
  }

  return e;
};

module.exports = RawPacketToEntity;
