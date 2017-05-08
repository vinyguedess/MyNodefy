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
Your Repository will work accordling to data configured on Entity.
But, you can create your own repository and add method respective to your business rules.

```javascript
    const Repository = require('mynodefy').Repository;

    class MyRepository extends Repository {}

    let repo = new MyRepository(MyEntity);

    repo
        .find()
        .first()
        .then(entity => {
            //Do something with entity
        });
```

## Querying
In MyNodefy you can query wanted data from basic to advanced.
You can get filtered data in three ways:

### All
Will return everything the table has filtered but without limit and offset.
```javascript
    repo.find()
        .all()
        .then(collection => {
            //Do something
        });
```

### Get
Works like All method but let you paginate collection with limit and offset
```javascript
    repo.find()
        .get()
        .then(collection => {
            //Do something
        });
```

### First
Get the first data that satisfies filters
```javascript
    repo.find()
        .first()
        .then(entity => {
            //Do something
        });
```

### Filtering
There are tow ways for filtering data:

#### By
Searching for value exactly equal filter. Recommended when searching by id
```javascript
    repo.find()
        .by('name', 'George Clooney')
        .get()
        .then(collection => {
            //Do something
        });
```

#### Where
To make a well and more elaborated query that needs advanced filtering, it's strongly recommended to use where.
As in the example below you can use too Expression class, that let you do comparision between fields.
```javascript
    const Expression = require('mynodefy').ORM.Query.Expression;

    let expr = new Expression();

    repo.find()
        .where.and(expr.like('address', 'Paulista Av.'))
        .where.or(expr.like('address', 'Marginal Pinheiros'))
        .get()
        .then(collection => {
            //Do something
        });
```

## Saving
To save an entity, you must just fill it respecting it's rules and pass to method save that is responsible for checking if Entity will be inserted or updated.

PS.: After insertion, Repository detects Entity ID and auto update it.

```javascript
    let entity = new MyEntity();
    entity.name = 'Mariah Carey';
    entity.job = 'Singer';
    entity.age = 42;

    repo.save(entity)
        .then(response => {
            //Response will be true or false
        });
```

## Association


## Conclusion

Sorry if you feel frustrated seeing this document. But, documentation is being developed as long as project is being developed too.