[source](https://dev.to/andreasbergstrom/rename-a-mongodb-database-in-two-commands-1n47)

# saving
``` mongodump -d ProspectDb -o mongodump/ ```
- will output to mongodump/ProspectDb

# removing
in mongodb compass shell (not a cli tool?)
```
use ProspectDb
db.dropDatabase()
```

# adding
``` mongorestore -d ProspectDb mongodump/folder ```
- the database 'dump' stored in mongodump/folder gets put back into mongodb as ProspectDb
