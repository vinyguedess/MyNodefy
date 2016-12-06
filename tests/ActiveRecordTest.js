const assert = require('chai').assert,
    Dominio = require('./DataProvider/Model/Dominio');

describe('ActiveRecordTest', function() {

    var generatedId = null;

    it('Should INSERT model on database', function (done) {
        var dominio = new Dominio();
        dominio.url = 'www.google.com';
        dominio.save().then(function (response) {
            assert.isTrue(response);
            assert.equal(dominio.url, 'www.google.com');
            assert.equal(1, dominio.ativo);
            assert.equal(dominio.getAttributes().id, dominio.id);

            generatedId = dominio.id;
        }).then(done);
    });

    it('Should UPDATE model on database', function(done) {
        new Dominio().find(generatedId).then(function(dominio) {
            dominio.url = 'www.bing.com';

            return dominio.save().then(function(response) {
                assert.isTrue(response);
            });
        }).then(done);
    });

    it('Should FIND model by ID', function (done) {
        new Dominio().find(generatedId).then(function(dominio) {
            assert.equal(generatedId, dominio.id);
            assert.instanceOf(dominio, Dominio);
        }).then(done);
    });

    it('Should find all models registrate in database', function () {
        new Dominio().findAll().then(function(arrayListDominios) {
            assert.equal(arrayListDominios.length, 1);
            assert.instanceOf(arrayListDominios[0], Dominio);
        });
    });

});

