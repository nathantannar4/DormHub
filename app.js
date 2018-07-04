'use strict';

const mysql = require('mysql');
const express = require("express");
const bodyParser = require('body-parser');
const childProcess = require('child_process');

const HOST = process.env.HOST || 'localhost';
const DB_USER = process.env.DB_NAME || 'root';
const DB_USER_PWD = process.env.DB_NAME || 'rootpassword';
const DB_NAME = process.env.DB_NAME || 'prod';

/* Connection Pooling is a mechanism to maintain a cache of database 
connections. This way, that connection can be reused after releasing it */
const pool = mysql.createPool({
    connectionLimit : 100,
    host     : HOST,
    user     : DB_USER,
    password : DB_USER_PWD,
    database : DB_NAME,
    debug    : false
});

/***********************/
/*** Helper Functions **/
/***********************/

function getConnection() {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(error, connection) {
            if (error) {
                connection.release();
                console.log(error);
                reject(error);
            } else {
                resolve(connection);
            }
        });
    });
}

function queryDatabase(query, data) {
    return new Promise(function(resolve, reject) {
        getConnection().then((connection) => {
            connection.query(query, data, function(error, rows, fields){
                connection.release();
                if (error) reject(error);
                else resolve(rows, fields);
            });
            // connection.on('error', function(error) {  
            //     console.log(error);    
            //     reject(error);
            // });
        }).catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}

function sequentiallyExecute(functions) {
    return functions.reduce((promise, func) =>
        promise.then(result => func().then(Array.prototype.concat.bind(result))),
        Promise.resolve([]))
}

const concat = (x,y) => x.concat(y)
const flatMap = (f,xs) => xs.map(f).reduce(concat, [])
Array.prototype.flatMap = function(f) { return flatMap(f,this) }

/***********************/
/******* Express *******/
/***********************/

/// Create the Exporess web app
const app = express();
app.use(bodyParser.json())

/***********************/
/******* Routes ********/
/***********************/

app.get("/", function(request, response) {
    response.json({"code": 200, "status": "Welcome to DormHub"});
})

app.post("/deploy", function(request, response) {
    console.log("> Deploying updates...");
    childProcess.exec('sh deploy.sh', function(error, stdout, stderr) {
        if (error) {
            console.log("> Deployment Failed");
            return response.json(error);
        }
        console.log("> Updates Deployed Successfully");
        response.json({"code": 200, "status": "DormHub Deployed"});
    });
})
  
/// Populates the SQL database with the sample data
app.get("/populate", function(request, response) {

    const sampleData = require("./SampleData.json");
    const tables = Object.keys(sampleData);

    if (tables.length == 0) return response.json({"code": 100, "status": "No data to populate database in `SampleData.json`"})

    const dropTasks = tables.map(table => { 
        return () => queryDatabase("DROP TABLE IF EXISTS " + table) 
    });
    const createTasks = tables.map(table => {
        return () => queryDatabase(sampleData[table].SQL.create)
    });
    const dataTasks = tables.flatMap(table => {
        return sampleData[table].data.map(record => {
            return () => queryDatabase("INSERT INTO " + table + " SET ?", record)
        })
    });

    sequentiallyExecute(dropTasks)
        .then(sequentiallyExecute(createTasks))
        .then(sequentiallyExecute(dataTasks))
        .then(() => {
            response.json({"code": 200, "status": "SQL Database populated with `SampleData.json`"})
        }).catch((error) => {
            response.json(error);
    })
})

// /// Query for all Persons 
app.get("/persons", function(request, response) {
    queryDatabase("SELECT * FROM Person")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for Person with specified ID
app.get("/person/:id", function(request, response) {
    const id = request.params.id
    queryDatabase("SELECT * FROM Person WHERE id = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for all Seekers 
app.get("/seekers", function(request, response) {
    queryDatabase("SELECT * FROM Seeker, Person WHERE Seeker.pid = Person.id")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for Seeker with specified ID
app.get("/seeker/:id", function(request, response) {
    const id = request.params.id
    queryDatabase("SELECT * FROM Seeker, Person WHERE Seeker.pid = Person.id AND WHERE pid = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for all Landlords 
app.get("/landlords", function(request, response) {
    queryDatabase("SELECT * FROM Landlord, Person WHERE Landlord.pid = Person.id")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for Seeker with specified ID
app.get("/landlord/:id", function(request, response) {
    const id = request.params.id
    queryDatabase("SELECT * FROM Landlord, Person WHERE Landlord.pid = Person.id AND WHERE pid = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for all Reviews
app.get("/reviews", function(request, response) {
    queryDatabase("SELECT * FROM Review")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for Review with specified ID
app.get("/review/:id", function(request, response) {
    const id = request.params.id
    queryDatabase("SELECT * FROM Review WHERE pid = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for all Locations
app.get("/locations", function(request, response) {
    queryDatabase("SELECT * FROM Location")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for all Location in specified city
app.get("/location/:city", function(request, response) {
    const city = request.params.city;
    queryDatabase("SELECT * FROM Location WHERE city = " + city)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/***********************/
/****** Networking *****/
/***********************/

/// Start the app listening on port 3000
app.listen(3000, function() {
    console.log('> Listening at localhost:3000');
});