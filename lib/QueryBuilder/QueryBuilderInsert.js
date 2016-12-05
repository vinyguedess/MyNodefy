const Connection = require('./../Connection');

var QueryBuilderInsert = function() {

    var conn = Connection.getConnection(), into, fields = {};

    this.into = function(insertInto) {
        if (typeof insertInto !== 'undefined')
            into = insertInto;

        return this;
    }

    this.addField = function () {
        if (arguments.length === 2) {
            if (arguments[1].constructor === Date)
                arguments[1] = arguments[1].format('Y-m-d H:i:s');

            fields[arguments[0]] = arguments[1];
        }

        return this;
    }

    this.toSql = function() {
        var queryFields = [], queryFieldsValues = [], generatedQuery = `INSERT INTO ${into}`;

        for (var i in fields) {
            queryFields.push(i);
            queryFieldsValues.push(typeof fields[i] === 'number' ? fields[i] : `"${fields[i]}"`);
        }

        generatedQuery += " (" + queryFields.join(', ') + ")";
        generatedQuery += " VALUES (" + queryFieldsValues.join(', ') + ");";

        return generatedQuery;
    }

    this.execute = function () {
        var queryToBeExecuted = this.toSql();

        return new Promise(function (resolve, reject) {
            conn.query(queryToBeExecuted, function(err, response) {
                if (err)
                    reject(err);

                resolve(response);
            });
        });
    }

};

module.exports = QueryBuilderInsert;