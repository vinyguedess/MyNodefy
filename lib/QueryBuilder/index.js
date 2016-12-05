const Connection = require('./../Connection'),
    QueryBuilderSelect = require('./QueryBuilderSelect'),
    QueryBuilderInsert = require('./QueryBuilderInsert'),
    QueryBuilderUpdate = require('./QueryBuilderUpdate'),
    QueryBuilderDelete = require('./QueryBuilderDelete');


var QueryBuilder = function() {

    this.select = function () {
        var select = arguments[0] || '*';

        return new QueryBuilderSelect(select);
    }

    this.insert = function () {
        return new QueryBuilderInsert();
    }

    this.update = function (tableToUpdate) {
        return new QueryBuilderUpdate(tableToUpdate);
    }

    this.delete = function () {
        return new QueryBuilderDelete();
    }

    this.getConnectionInfo = function(conn) {
        return Connection.getInformation(conn);
    }

};

module.exports = QueryBuilder;
