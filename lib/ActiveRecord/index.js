const SchemaData = require('./SchemaData'),
    QueryBuilder = SchemaData.getQueryBuilder();

var ActiveRecord = function () {

    var self = this, md = new SchemaData(this.tableName);

    this.isNewRecord = true;

    this.save = function() {
        return md.loadMetaData().then(function(md) {
            if (self.isNewRecord)
                return self.create(md);
            else
                return self.update(md);
        });
    }

    this.create = function(md) {
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

        return qb.execute().then(function(response) {
            if (response) {
                self.isNewRecord = false;

                if (typeof md.getPrimaryKey() !== 'undefined')
                    self[md.getPrimaryKey()] = response.insertId;

                return true;
            }

            return false;
        });
    }

    this.update = function() {

    }

    this.find = function (id) {
        return new QueryBuilder()
            .select()
            .from(this.tableName)
            .fetch();
    };

};

module.exports = ActiveRecord;