const assert = require('chai').assert,
    Dominio = require('./DataProvider/Model/Dominio');

describe('ActiveRecordTest', function() {

    it('Should save model into database', function () {
        var dominio = new Dominio();
        dominio.url = 'www.google.com';
        dominio.save().then(function (response) {
            assert.isTrue(response);
            assert.equal(dominio.url, 'www.google.com');
            assert.equal(1, dominio.ativo);
        });
    });

});

