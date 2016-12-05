const MyNodeFy = require('./../../../index'),
    ActiveRecord = MyNodeFy.ActiveRecord,
    util = require('util');

var Dominio = function () {
    ActiveRecord.call(this);
};
util.inherits(Dominio, ActiveRecord);

Dominio.prototype.tableName = 'dominios';

module.exports = Dominio;