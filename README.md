![CircleCI](https://circleci.com/gh/vinyguedess/mynodefy/tree/master.svg?style=svg)
![Codecov](https://img.shields.io/codecov/c/github/vinyguedess/mynodefy.svg)

# MyNodefy
A NodeJS's ORM designed for designers. And, based on PHP's Doctrine.

## First things first
Before you can use it good, you must define and configure some informations.

### Connection
You must define your connection informations before you could really start.
```javascript
    const mynodefy = require('mynodefy');

    mynodefy.Connection.define('host', 'username', 'password', 'database');
```

### Entity
You can configure your entity by returning an object of informations on rule method.
It's not required unless you strictly want MyNodefy to validate your information before it persists onto database.

You can also pass information about database table name that is being represented by the Entity using method tableName. In case this method doesn't exists, entity name is used in plural form.
```javascript
    class MyEntity
    {

        tableName()
        {
            return 'table_name';
        }

        rules(
            return {
                id: { type: 'integer', key: 'primary' },
                name: { type: 'varchar', size: 100, null: false },
                age: { type: 'integer', size: 3, null: true }
            };
        )

    }
```

### Repository


## Querying


## Saving


## Association


## Conclusion

Sorry if you feel frustrated seeing this document. But, documentation is being developed and long project is being developed too.