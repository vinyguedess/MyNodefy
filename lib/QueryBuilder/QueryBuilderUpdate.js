const Connection = require('./../Connection'),
    QueryBuilderWhereManipulator = require('./QueryBuilderWhereManipulator');

var QueryBuilderUpdate = function (table) {

    var conn = Connection.getConnection(),
        updateTable = table, fields, wheres;

    this.criteria = new QueryBuilderWhereManipulator(this);

    this.set = function (field, value) {
        if (typeof fields === 'undefined')
            fields = {};

        if (typeof field !== 'undefined' && typeof value !== 'undefined')
            fields[field] = value;

        return this;
    };

    this.toSql = function () {
        var fieldsToUpdate = [],
            builtSql = `UPDATE ${updateTable} SET `;

        for (var i in fields) {
            if (typeof fields[i] === 'string')
                fields[i] = `"${fields[i]}"`;

            fieldsToUpdate.push(`${i} = ${fields[i]}`)
        }
        builtSql += fieldsToUpdate.join(', ');

        builtSql += this.criteria.getSqlWhere();

        return builtSql + ';';
    };

    this.execute = function() {
        var queryToBeExecuted = this.toSql();

        return new Promise(function (resolve, reject) {
            conn.query(queryToBeExecuted, function(err, response) {
                if (err)
                    reject(err);

                resolve(response);
            });
        });
    };

};

module.exports = QueryBuilderUpdate;
