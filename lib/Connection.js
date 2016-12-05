var mysql = require('mysql'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'localhost',
        database: 'mynodefy_testing'
    });

module.exports.getConnection = function() {
    return connection;
};
