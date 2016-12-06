const SchemaData = require('./SchemaData'),
    QueryBuilder = SchemaData.getQueryBuilder();

var ActiveRecord = function () {

    var self = this, md = new SchemaData(this.tableName);

    this.isNewRecord = true;

    this.getAttributes = function () {
        var attributes = {}, fields = md.getFields();

        for (var i in fields) {
            attributes[i] = this[i];
        }

        return attributes;
    }

    this.save = function () {
        return md.loadMetaData().then(function (md) {
            if (self.isNewRecord)
                return self.create(md);
            else
                return self.update(md);
        });
    }

    this.create = function (md) {
        var fields = md.getFields();

        var qb = new QueryBuilder().insert().into(this.tableName);
        for (var i in fields) {
            if (typeof self[i] !== 'undefined')
                qb.addField(i, self[i])

            if (typeof self[i] === 'undefined') {
                if (fields[i].default !== null) {
                    self[i] = fields[i].default;
                    qb.addField(i, self[i]);
                }
            }
        }

        return qb.execute().then(function (response) {
            if (response) {
                self.isNewRecord = false;

                if (typeof md.getPrimaryKey() !== 'undefined')
                    self[md.getPrimaryKey()] = response.insertId;

                return true;
            }

            return false;
        });
    }

    this.update = function (md) {
        var fields = md.getFields();

        var qb = new QueryBuilder().update(this.tableName);
        for (var i in fields) {
            if (typeof self[i] !== 'undefined')
                qb.set(i, self[i])

            if (typeof self[i] === 'undefined') {
                if (fields[i].default !== null) {
                    self[i] = fields[i].default;
                    qb.set(i, self[i]);
                }
            }
        }

        return qb.criteria.where(md.getPrimaryKey(), self[md.getPrimaryKey()])
            .execute()
            .then(function (response) {
                if (response)
                    return true;

                return false;
            });
    }

    this.find = function (id) {
        return md.loadMetaData().then(function (md) {
            return new QueryBuilder()
                .select()
                .from(self.tableName)
                .criteria.where(md.getPrimaryKey(), id)
                .fetch().then(function (response) {
                    if (response !== null)
                        return generateModelFromAttributes(md, response);

                    return null;
                });
        });
    };

    this.findAll = function() {
        return md.loadMetaData().then(function (md) {
            var qb = new QueryBuilder().select().from(self.tableName)

            return qb.fetchAll().then(function (response) {
                var arrayList = [];
                for (var i in response)
                    arrayList.push(generateModelFromAttributes(md, response[i]));

                return arrayList;
            });
        });
    };

    var generateModelFromAttributes = function(md, attributes) {
        var fields = md.getFields(),
            currentModel = self;

        for (var i in fields) {
            if (fields[i].type === 'datetime') {
                currentModel[i] = new Date(attributes[i]).format('Y-m-d H:i:s');
                continue;
            }

            currentModel[i] = attributes[i];
        }
        currentModel.isNewRecord = false;

        return currentModel;
    };

};

module.exports = ActiveRecord;