# R.A.Zenin Database

## Note
- ZeninDB only return false when getting error
- ZeninDB (version 0.0.1) only return with default log, (next) return with custom log
- I recommend you to backup old data first and try it on the other hand, this version is not perfect yet, there are still many bugs undiscovered, please report bugs if found

## What's ZeninDB
- ZeninDB is the Database used in the R.A.Zenin bot
- ZeninDB there is a default Object on each database if the Database is a list
- ZeninDB has a feature designed for the R.A.Zenin bot to access uptodate data without loading all databases
- Need Help Using ZeninDB? [Here](#zenindb) 

## ZeninDB
- Getting started with [ZeninDB](#whats-zenindb)? [Here](#start)
- Need Help in setDefaultObject? [Here](#set-default-object)
- Need Help in create? [Here](#create-database)
- Need Help in Import latest Database to ZeninDB? [Here](#import-database)

## Start
#### Install This Module
```npm install github:@HabustNyeh/zeninDB```
#### Install Module Require
```npm install pino```
#### And Then
```let zeninDB = require('ZeninDB');```

## Set Default Object
#### You Need to set the Default Object for Default Folder ZeninDB
```
//Should be set
let zeninDB = require('ZeninDB');
let objUser = { exp: 1000, ... }; //It doesn't always have to be exp, it's free as needed
let objChat = { detect: true, ... }; //It doesn't always have to be detect, it's free as needed

zeninDB.setDefaultObject('user', objUser);
zeninDB.setDefaultObject('chat', objChat);
```

## Create Database
#### Creating Database, Need a String folder
[Previously](#set-default-object)
```
const { join, resolve } = require('path');
let folder = join(resolve(), 'database');
let db = zeninDB.create(folder);
if(!db) return console.error(db);
```

## Import Database
#### Importing Latest Database to ZeninDB
[Previously](#create-database)
```
//YOU NEED TO BE IN ASYNC MODE
let result;
try {
  //result = await db.nameOfDatabase.import(nameOfFileJsonToImport, nameOfDbInJsonToImport);
  result = await db.user.import(join(resolve(), 'database.json'), 'users');
} catch (e) {
  console.error(e);
} finally {
  console.log(result);
}
```
