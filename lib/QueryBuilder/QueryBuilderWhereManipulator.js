var QueryBuilderWhereManipulator = function(calledBy) {

    var wheres = [];

    this.where = function () {
        manipulate(arguments);

        return calledBy;
    };

    this.orWhere = function () {
        if (arguments.length > 1) {
            var field, comparision, value;
            if (arguments.length === 2)
                field = arguments[0], value = arguments[1], comparision = '=';

            if (arguments.length === 3)
                field = arguments[0], value = arguments[2], comparision = arguments[1];

            return this.where(field, comparision, value, 'OR');
        }

        if (arguments.length === 1) {
            arguments[0].push('OR');
            return this.where(arguments[0]);
        }

        return this;
    };

    this.getSqlWhere = function() {
        var builtSqlWheres = '';

        if (typeof wheres === 'undefined')
            wheres = [];

        if (wheres.length > 0) {
            builtSqlWheres += ' WHERE ';
            for (var i in wheres) {
                var where = wheres[i];
                if (where[0].constructor === Array) {
                    builtSqlWheres += "(";
                    for (var j in where) {
                        if (where[j].constructor !== Array)
                            break;

                        [field, comparision, value, type] = where[j];

                        if (comparision == '=' && value === null)
                            comparision = 'is';
                        else if (comparision == '<>' && value === null)
                            comparision = 'is not';

                        if (typeof value === 'string')
                            value = `"${value}"`;
                        else if (value !== null && value.constructor == Array)
                            value = "(" + value.join(', ') + ")";

                        builtSqlWheres += `${field} ${comparision} ${value}`;
                        if (j < where.length - 2)
                            builtSqlWheres += ` ${type} `;
                    }
                    builtSqlWheres += ") " + where[where.length - 1] + " ";

                    continue;
                }

                [field, comparision, value, type] = where;

                if (comparision == '=' && value === null)
                    comparision = 'is';
                else if (comparision == '<>' && value === null)
                    comparision = 'is not';

                if (typeof value === 'string')
                    value = `"${value}"`;
                else if (value !== null && value.constructor == Array)
                    value = "(" + value.join(', ') + ")";

                builtSqlWheres += `${field} ${comparision} ${value}`;
                if (i < wheres.length - 1)
                    builtSqlWheres += ` ${type} `;
            }
        }

        return builtSqlWheres;
    }

    var manipulate = function (arguments) {
        if (typeof wheres === 'undefined')
            wheres = [];

        var field, comparision, value, type;

        if (arguments.length > 1) {
            if (arguments.length === 4)
                field = arguments[0], comparision = arguments[1], value = arguments[2], type = arguments[3];
            else if (arguments.length == 3)
                field = arguments[0], comparision = arguments[1], value = arguments[2], type = "AND";
            else if (arguments.length == 2)
                field = arguments[0], comparision = "=", value = arguments[1], type = "AND";

            if (value.constructor === Array) {
                comparision = comparision === '!=' || comparision === '<>' ? "NOT IN": 'IN';
                // value = "(" + value.join(',') + ")";
            }

            wheres.push([field, comparision, value, type]);
        }

        if (arguments.length == 1) {
            var where = arguments[0];
            for (var i in where) {
                if (where[i].constructor !== Array)
                    break;

                if (where[i].length == 3)
                    where[i] = [where[i][0], where[i][1], where[i][2], 'AND'];
                else if (where[i].length == 2)
                    where[i] = [where[i][0], '=', where[i][1], 'AND'];
            }

            if (typeof where[where.length - 1] !== 'string')
                where[where.length - 1] = 'AND';

            wheres.push(where);
        }

        return wheres;
    }

};

module.exports = QueryBuilderWhereManipulator;