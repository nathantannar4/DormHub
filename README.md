# DormHub

> CMPT 354 - Database Systems 1 Project

## Requirements

- MySQL
- NodeJS 
- ReactJS

## Start

Edit `api.js` to reflect your MySQL database connection parameters
> You may need to create a new database. By default `api.js` connects to the `prod` database.

```
npm i // To install the API dependencies
cd app
npm i // To install the ReactJS App dependencies
ce ..
npm start // Start the API/App concurrently
```

## Automated Deployment

Automated deployment is set up to automatically pull updates from a GitHub repo whenever it is pushed to. This is done by utilizing GitHubs Webhook functionality. Automated Deployment requires an ssh keypair to be generated on the server and added to your GitHub profile's keys.

## Sample Data

To load `SampleData.json` into the SQL database call `/populate` route. This will drop, create and then insert the `SampleData.json` tuples into each table