var mysql = require('mysql'),
    config = {
        default: {
            host: 'localhost',
            user: 'root',
            password: 'localhost',
            database: 'mynodefy_testing'
        }
    }, connection;

module.exports.setConnection = function () {
    if (arguments.length === 1)
        config['default'] = arguments[0];
    else if (arguments.length === 2)
        config[arguments[0]] = arguments[1];
}

module.exports.getConnection = function (connectionName) {
    if (typeof connection === 'undefined')
        connection = [];

    if (typeof connectionName === 'undefined')
        connectionName = 'default';

    if (typeof connection[connectionName] === 'undefined')
        connection[connectionName] = mysql.createConnection(config[connectionName]);

    return connection[connectionName];
};
