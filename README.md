# DormHub

> CMPT 354 - Database Systems 1 Project

## Requirements

- MySQL
- NodeJS 

## Start

Edit `app.js` to reflect your MySQL database connection parameters
> You may need to create a new database. By default `app.js` connects to the `prod` database.

```
npm start
```

## Sample Data

To load `SampleData.json` into the SQL database call `/populate` route. This will drop, create and then insert the `SampleData.json` tuples into each table