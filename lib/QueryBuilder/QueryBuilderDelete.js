const Connection = require('./../Connection'),
    QueryBuilderWhereManipulator = require('./QueryBuilderWhereManipulator');

var QueryBuilderDelete = function () {

    var conn = Connection.getConnection(),
        table, wheres;

    this.criteria = new QueryBuilderWhereManipulator(this);

    this.from = function (fromTable) {
        if (typeof fromTable !== 'undefined')
            table = fromTable;

        return this;
    };

    this.toSql = function () {
        var builtSql = `DELETE FROM ${table}`;

        builtSql += this.criteria.getSqlWhere();

        return builtSql + ';';
    };

    this.execute = function () {
        var queryToBeExecuted = this.toSql();

        return new Promise(function (resolve, reject) {
            conn.query(queryToBeExecuted, function (err, response) {
                if (err)
                    reject(err);

                resolve(response);
            });
        });
    };

};

module.exports = QueryBuilderDelete;

