'use strict';

const mysql = require('mysql');
const express = require("express");
const bodyParser = require('body-parser');

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

function handleDatabaseConnectionError(response) {
    response.json({"code": 100, "status": "Error in connection database"});
}

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
        if (error) {
            callback(error, null, null);
        } else {
            connection.query(query, data, function(error, rows, feilds){
                connection.release();
                callback(error, rows, feilds);       
            });
            connection.on('error', function(error) {      
                callback(error, null, null);
            });
        }
    });
}

const app = express();
app.use(bodyParser.json())

app.get("/populate", function(request, response) {

    const sampleData = require("./SampleData.json");
    for (const table of Object.keys(sampleData)) {
        // Drop current table
        queryDatabase(sampleData[table].SQL.drop, null, function(error, rows) {
            // Create new table
            queryDatabase(sampleData[table].SQL.create, null, function(error, rows) {
                // Fill table with data
                for (const j in sampleData[table].data) {
                    queryDatabase(sampleData[table].SQL.insert, sampleData[table].data[j], function(error, rows, feilds) {
                        if (error) console.log(error);
                    });
                }
            });
        });
    }
    response.json({"code": 200, "status": "Complete"})
})

/// Query for all User's 
app.get("/users", function(request, response) {
    queryDatabase("SELECT * FROM User", null, function(error, rows, feilds) {
        if (error) return handleDatabaseConnectionError(response);
        response.json(rows);
    });
})

/// Query for user with specified ID
app.get("/user/:userID", function(request, response) {
    const userID = request.params.userID
    queryDatabase("SELECT * FROM User WHERE id = " + userID, null, function(error, rows, feilds) {
        if (error) return handleDatabaseConnectionError(response);
        response.json(rows);
    });
})

/// Start the app listening on port 3000
app.listen(3000, function() {
    console.log('> Listening at localhost:3000');
});