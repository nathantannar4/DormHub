'use strict';

const mysql = require('mysql');
const express = require("express");
const bodyParser = require('body-parser');
const childProcess = require('child_process');

/* Connection Pooling is a mechanism to maintain a cache of database 
connections. This way, that connection can be reused after releasing it */
const pool = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'rootpassword',
    database : 'prod',
    debug    :  false
});

/***********************/
/*** Helper Functions **/
/***********************/

function getConnection(callback) {
    pool.getConnection(function(error, connection) {
        if (error) {
            connection.release();
            callback(error, null);
        }   
        callback(null, connection);
    });
}

function queryDatabase(query, data, callback) {
    getConnection(function(error, connection) {
        if (error) return callback(error, null, null);
        connection.query(query, data, function(error, rows, feilds){
            connection.release();
            callback(error, rows, feilds);       
        });
        connection.on('error', function(error) {      
            callback(error, null, null);
        });
    });
}

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
    conosle.log(request);
    childProcess.exec('sh deploy.sh', function(error, stdout, stderr) {
        console.log(`${stdout}`);
        console.log(`${stderr}`);
        if (error) {
            console.log(`exec error: ${error}`);
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
    for (const table of tables) {
        // Drop current table
        queryDatabase(sampleData[table].SQL.drop, null, function(error, rows) {
            if (error) { 
                console.log(error);
                return response.json({"code": 101, "status": "Failed to DROP table `" + table + "`"})
            }
            // Create new table
            queryDatabase(sampleData[table].SQL.create, null, function(error, rows) {
                if (error) {
                    console.log(error);
                    return response.json({"code": 101, "status": "Failed to CREATE table `" + table + "`"})
                }
                // Fill table with data
                const isLastTable = table == tables[tables.length - 1];
                const lastInsert = sampleData[table].data.length - 1;
                for (const i in sampleData[table].data) {
                    queryDatabase(sampleData[table].SQL.insert, sampleData[table].data[i], function(error, rows, fields) {
                        if (error) { 
                            console.log(error);
                            return response.json({"code": 101, "status": "Failed to INSERT VALUES INTO table `" + table + "` with data"})
                        } else {
                            if (isLastTable && lastInsert == i) {
                                response.json({"code": 200, "status": "SQL Database populated with `SampleData.json`"})
                            }
                        }
                    });
                }
            });
        });
    }
})

/// Query for all Seekers 
app.get("/seekers", function(request, response) {
    queryDatabase("SELECT * FROM Seeker", null, function(error, rows, fields) {
        if (error) return response.json(error);
        response.json(rows);
    });
})

/// Query for Seeker with specified ID
app.get("/seeker/:id", function(request, response) {
    const id = request.params.id
    queryDatabase("SELECT * FROM Seeker WHERE id = " + id, null, function(error, rows, fields) {
        if (error) return response.json(error);
        response.json(rows);
    });
})

/// Query for all Landlords 
app.get("/landlords", function(request, response) {
    queryDatabase("SELECT * FROM Landlord", null, function(error, rows, fields) {
        if (error) return response.json(error);
        response.json(rows);
    });
})

/// Query for Seeker with specified ID
app.get("/landlord/:id", function(request, response) {
    const id = request.params.id
    queryDatabase("SELECT * FROM Landlord WHERE id = " + id, null, function(error, rows, fields) {
        if (error) return response.json(error);
        response.json(rows);
    });
})

/// Query for all Reviews
app.get("/reviews", function(request, response) {
    queryDatabase("SELECT * FROM Review", null, function(error, rows, fields) {
        if (error) return response.json(error);
        response.json(rows);
    });
})

/// Query for Review with specified ID
app.get("/review/:id", function(request, response) {
    const id = request.params.id
    queryDatabase("SELECT * FROM Review WHERE id = " + id, null, function(error, rows, fields) {
        if (error) return response.json(error);
        response.json(rows);
    });
})

/// Query for all Locations
app.get("/locations", function(request, response) {
    queryDatabase("SELECT * FROM Location", null, function(error, rows, fields) {
        if (error) return response.json(error);
        response.json(rows);
    });
})

/// Query for all Location in specified city
app.get("/location/:city", function(request, response) {
    const city = request.params.city;
    queryDatabase("SELECT * FROM Location WHERE city = " + city, null, function(error, rows, fields) {
        if (error) return response.json(error);
        response.json(rows);
    });
})

/***********************/
/****** Networking *****/
/***********************/

/// Start the app listening on port 3000
app.listen(3000, function() {
    console.log('> Listening at localhost:3000');
});