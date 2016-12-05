const QueryBuilder = require('./../QueryBuilder/index');

var SchemaData = function (tableName) {

    var isLoaded = false, fields = {}, primaryKey,
        connInfo = new QueryBuilder().getConnectionInfo();

    this.loadMetaData = function() {
        var selfMd = this;
        return new QueryBuilder().select()
            .from('INFORMATION_SCHEMA.COLUMNS')
            .criteria.where('TABLE_SCHEMA', connInfo.database)
            .criteria.where('TABLE_NAME', tableName)
            .fetchAll()
            .then(function (response) {
                for (var i in response) {
                    if (response[i].COLUMN_KEY == 'PRI')
                        primaryKey = response[i].COLUMN_NAME;

                    fields[response[i].COLUMN_NAME] = {
                        type: treatFieldType(response[i].DATA_TYPE),
                        maxLength: response[i].CHARACTER_MAXIMUM_LENGTH,
                        isNull: response[i].IS_NULLABLE === 'NO' ? false : true,
                        default: treatFieldDefaultValue(response[i].COLUMN_DEFAULT)
                    };
                }

                return selfMd;
            });
    }

    this.getPrimaryKey = function () {
        if (primaryKey === null)
            return Object.keys(fields)[0];

        return primaryKey;
    }

    this.getFields = function (field) {
        if (typeof field !== 'undefined' && typeof fields[field] !== 'undefined')
            return fields[field];

        return fields;
    }

    var treatFieldType = function (fieldType) {
        if (['varchar', 'text', 'blob'].indexOf(fieldType) >= 0)
            return 'string';

        if (['int', 'tinyint', 'float', 'real'].indexOf(fieldType) >= 0)
            return 'number';

        return fieldType;
    };

    var treatFieldDefaultValue = function (defaultValue) {
        if (['NOW', 'CURRENT_TIMESTAMP'].indexOf(defaultValue) >= 0)
            return new Date().format('Y-m-d H:i:s');

        if (['CURRENT_DATE'].indexOf(defaultValue) >= 0)
            return new Date().format('Y-m-d');

        return defaultValue;
    }

};

SchemaData.getQueryBuilder = function () {
    return QueryBuilder;
}

module.exports = SchemaData;