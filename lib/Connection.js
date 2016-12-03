var mysql = require('mysql'),
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'localhost',
        database: 'leads'
    });

module.exports.getConnection = function() {
    return connection;
};
