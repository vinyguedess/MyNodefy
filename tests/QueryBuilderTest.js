const assert = require('chai').assert,
    MyNodefy = require('./../index'),
    QueryBuilder = MyNodefy.QueryBuilder;

describe('QueryBuilderTest', function () {

    it('Should be a QueryBuilder instance', function () {
        assert.instanceOf(new QueryBuilder(), QueryBuilder);
    });

    describe('QueryBuilderInsertTest', function () {
        describe('Generating INSERT queries', function () {
            it('Should generate a simple insert', function () {
                assert.equal('INSERT INTO dominios (id, url) VALUES (1, "google.com");', new QueryBuilder()
                    .insert()
                    .into('dominios')
                    .addField('id', 1)
                    .addField('url', 'google.com')
                    .toSql());
            });
        });

        describe('Executing INSERT queries', function() {
            it('Should execute a simple insert', function(done) {
                new QueryBuilder().insert().into('dominios')
                    .addField('url', 'google.com')
                    .addField('data_criacao', new Date())
                    .execute()
                    .then(function(response) {
                        assert.isObject(response);
                        assert.equal(1, response.affectedRows);
                        assert.equal(2, response.serverStatus);
                    }).then(done);
            });
        });
    });

    describe('QueryBuilderSelectTest', function () {
        describe('Generating SELECT queries', function () {
            it('Should generate a simple query', function () {
                assert.equal('SELECT * FROM dominios;', new QueryBuilder().select('*').from('dominios').toSql());

                assert.equal('SELECT * FROM dominios LIMIT 100;', new QueryBuilder().select(['*'])
                    .from('dominios')
                    .setLimit(100)
                    .toSql());

                assert.equal('SELECT * FROM dominios LIMIT 3 OFFSET 0;', new QueryBuilder().select(['*'])
                    .from('dominios')
                    .setLimit(3)
                    .setOffset(0)
                    .toSql());

                assert.equal('SELECT Dominio.* FROM dominios `Dominio`;', new QueryBuilder()
                    .select('Dominio.*')
                    .from('dominios', 'Dominio')
                    .toSql());
            });

            it('Should test queries generation with JOINS', function () {
                assert.equal(
                    'SELECT * FROM dominios INNER JOIN palavras ON dominios.palavra_id = palavras.id;',
                    new QueryBuilder().select()
                        .from('dominios')
                        .innerJoin('palavras', 'palavra_id', 'id')
                        .toSql()
                );

                assert.equal(
                    'SELECT Palavra.* FROM dominios RIGHT JOIN palavras `Palavra` ON dominios.palavra_id = Palavra.id;',
                    new QueryBuilder().select('Palavra.*')
                        .from('dominios')
                        .rightJoin('palavras', 'palavra_id', 'id', 'Palavra')
                        .toSql()
                );

                assert.equal(
                    'SELECT Palavra.* FROM dominios LEFT JOIN palavras `Palavra` ON dominios.palavra_id = Palavra.id;',
                    new QueryBuilder().select('Palavra.*')
                        .from('dominios')
                        .leftJoin('palavras', 'palavra_id', 'id', 'Palavra')
                        .toSql()
                );
            });

            it('Should test queries generation with WHERES', function () {
                assert.equal('SELECT * FROM dominios WHERE dominios.url LIKE "%groupie%";', new QueryBuilder()
                    .select()
                    .from('dominios')
                    .where('dominios.url', 'LIKE', '%groupie%')
                    .toSql());

                assert.equal('SELECT * FROM dominios WHERE dominios.id >= 1 OR dominio.id = 2;', new QueryBuilder()
                    .select()
                    .from('dominios')
                    .orWhere('dominios.id', '>=', 1)
                    .orWhere('dominio.id', 2)
                    .toSql());

                assert.equal('SELECT * FROM dominios WHERE (dominios.status is not null AND dominios.id > 0) OR dominios.id = 0;', new QueryBuilder()
                    .select()
                    .from('dominios')
                    .orWhere([
                        ['dominios.status', '<>', null],
                        ['dominios.id', '>', 0]
                    ])
                    .orWhere('dominios.id', 0)
                    .toSql());
            });

            it('Should test queries generation with GROUP and HAVING', function () {
                assert.equal('SELECT * FROM dominios GROUP BY url;', new QueryBuilder()
                    .select()
                    .from('dominios')
                    .setGroup('url')
                    .toSql());

                assert.equal('SELECT * FROM dominios GROUP BY url HAVING id > 0;', new QueryBuilder()
                    .select()
                    .from('dominios')
                    .setGroup('url', 'id > 0')
                    .toSql());
            });

            it('Should test queries generation with ORDER', function () {
                assert.equal('SELECT * FROM dominios ORDER BY dominios.id ASC;', new QueryBuilder()
                    .select()
                    .from('dominios')
                    .setOrder('id')
                    .toSql());

                assert.equal('SELECT * FROM dominios ORDER BY dominios.url DESC;', new QueryBuilder()
                    .select()
                    .from('dominios')
                    .setOrder('url', 'DESC')
                    .toSql());
            });
        });

        describe('Executing SELECT queries', function () {
            it('Should run query FETCHING ALL rows from result', function (done) {
                new QueryBuilder().select().from('dominios').setLimit(10).fetchAll().then(function (response) {
                    assert.isArray(response);
                    assert.isBelow(response.length, 11);

                    for (var i in response) {
                        assert.isObject(response[i]);
                        continue;
                    }
                }).then(done);
            });

            it('Should run query FETCHING single row', function (done) {
                new QueryBuilder().select().from('dominios').setLimit(10).fetch().then(function (response) {
                    if (response === null)
                        assert.isNull(response);
                    else
                        assert.isObject(response);
                }).then(done);
            });

            it('Should run query COUNTING registers', function (done) {
                new QueryBuilder().select().from('dominios').count().then(function (response) {
                    assert.isAbove(response, -1);
                    assert.isNumber(response);
                }).then(done);
            });
        });
    });

});