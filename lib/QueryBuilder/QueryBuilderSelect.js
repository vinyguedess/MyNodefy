const Connection = require('./../Connection'),
    QueryBuilderWhereManipulator = require('./QueryBuilderWhereManipulator');

var QueryBuilderSelect = function (select) {

    var conn = Connection.getConnection(),
        select = select, from, alias, joins, wheres, group, having, sort, order, limit, offset;

    this.criteria = new QueryBuilderWhereManipulator(this);

    this.select = function () {
        select = arguments[0] || ['*'];

        return this;
    };

    this.from = function () {
        from = arguments[0];
        alias = arguments[1];

        return this;
    };

    this.innerJoin = function (table, foreignKey, otherKey) {
        setJoin('INNER JOIN', table, foreignKey, otherKey, arguments[3]);

        return this;
    };

    this.rightJoin = function (table, foreignKey, otherKey, alias) {
        setJoin('RIGHT JOIN', table, foreignKey, otherKey, arguments[3]);

        return this;
    };

    this.leftJoin = function (table, foreignKey, otherKey, alias) {
        setJoin('LEFT JOIN', table, foreignKey, otherKey, arguments[3]);

        return this;
    };

    this.setGroup = function () {
        group = arguments[0].constructor === Array ? arguments[0].join(', ') : arguments[0];
        having = arguments[1];

        return this;
    }

    this.setOrder = function () {
        sort = arguments[0]
        order = arguments[1];

        return this;
    }

    this.setLimit = function () {
        limit = arguments[0];

        return this;
    };

    this.setOffset = function () {
        offset = arguments[0];

        return this;
    };

    this.toSql = function () {
        var builtSql = `SELECT ${toSqlSelect()} FROM ${toSqlFrom()}`;
        builtSql += toSqlJoins();
        builtSql += this.criteria.getSqlWhere();
        builtSql += toSqlGroup();
        builtSql += toSqlOrder();

        if (typeof limit !== 'undefined')
            builtSql += ` LIMIT ${limit}`;

        if (typeof offset !== 'undefined')
            builtSql += ` OFFSET ${offset}`;

        return builtSql + ';';
    }

    this.fetchAll = function (callback) {
        var queryToBeExecuted = this.toSql();

        return new Promise(function (resolve, reject) {
            conn.query(queryToBeExecuted, function (err, rows) {
                if (err)
                    reject(err);

                resolve(rows);
            });
        });
    }

    this.fetch = function () {
        var queryToBeExecuted = this.setLimit(1).toSql();

        return new Promise(function (resolve, reject) {
            conn.query(queryToBeExecuted, function (err, rows) {
                if (err)
                    reject(err);

                resolve(rows.length > 0 ? rows[0] : null);
            });
        });
    }

    this.count = function () {
        var queryToBeExecuted = this.select('COUNT(*) AS amount_rows').toSql();

        return new Promise(function (resolve, reject) {
            conn.query(queryToBeExecuted, function (err, rows) {
                if (err)
                    reject(err);

                resolve(rows[0].amount_rows);
            });
        });
    }

    var setJoin = function (type, table, foreignKey, otherKey, alias) {
        if (typeof joins === 'undefined')
            joins = [];

        joins.push([
            type, table, foreignKey, otherKey, alias
        ]);
    };

    var toSqlSelect = function () {
        if (typeof select !== 'string')
            select = select.join('*');

        return select;
    }

    var toSqlFrom = function () {
        var builtSqlFrom = from;

        if (typeof alias !== 'undefined')
            builtSqlFrom += ` \`${alias}\``;

        return builtSqlFrom;
    }

    var toSqlJoins = function () {
        var builtSqlJoins = '';

        for (var i in joins) {
            var join = joins[i];
            builtSqlJoins += ` ${join[0]} ${join[1]}`;

            if (typeof join[4] !== 'undefined')
                builtSqlJoins += ` \`${join[4]}\``;

            if (join[2].indexOf('.') < 0)
                join[2] = (typeof alias === 'undefined' ? from : alias) + `.${join[2]}`;

            if (join[3].indexOf('.') < 0)
                join[3] = (typeof join[4] === 'undefined' ? join[1] : join[4]) + `.${join[3]}`;

            builtSqlJoins += ` ON ${join[2]} = ${join[3]}`;
        }

        return builtSqlJoins;
    }

    var toSqlGroup = function () {
        var builtSqlGroup = '';
        if (typeof group !== 'undefined') {
            builtSqlGroup += ` GROUP BY ${group}`;

            if (typeof having !== 'undefined')
                builtSqlGroup += ` HAVING ${having}`;
        }

        return builtSqlGroup;
    }

    var toSqlOrder = function () {
        var builtSqlOrder = '';
        if (typeof sort !== 'undefined') {
            if (sort.indexOf('.') < 0)
                sort = (typeof alias === 'undefined' ? from : alias) + `.${sort}`;

            if (typeof order === 'undefined')
                order = 'ASC';

            builtSqlOrder += ` ORDER BY ${sort} ${order}`;
        }

        return builtSqlOrder;
    }

};

module.exports = QueryBuilderSelect;
