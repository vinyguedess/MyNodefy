const mysql = require("mysql");

class Connection {
  static define(host, username, password, database) {
    this._parameters = {
      connection: {
        host: host,
        user: username,
        password: password,
        database: database
      }
    };
  }

  static do() {
    let conn = mysql.createConnection(this._parameters.connection);
    conn.connect();

    return conn;
  }

  static query(query) {
    let conn = this.do();

    let promise = new Promise((resolve, reject) => {
      conn.query(query, (err, response, fields) => {
        if (err) return reject(err);

        return resolve(response, fields);
      });
    });

    conn.end();

    return promise;
  }

  static create(table, fields) {
    let query = `CREATE TABLE ${table} (`;
    Object.keys(fields).forEach((name, index, allFields) => {
      var field = fields[name];

      if (
        typeof field.size === "undefined" &&
        field.type.toLowerCase() === "integer"
      )
        field.size = 11;

      if (typeof field.null === "undefined") field.null = true;

      query += `${name} ${field.type.toUpperCase()}`;
      if (typeof field.size !== "undefined") query += `(${field.size})`;

      if (
        field.type.toLowerCase() === "integer" &&
        (typeof field.key !== "undefined" &&
          field.key.toLowerCase() === "primary")
      )
        query += " PRIMARY KEY AUTO_INCREMENT";

      query += field.null ? " NULL" : " NOT NULL";

      if (index < allFields.length - 1) query += ",";
    });
    query += ");";

    return this.query(query);
  }

  static drop(table) {
    return this.query(`DROP TABLE ${table};`);
  }
}

module.exports = Connection;
