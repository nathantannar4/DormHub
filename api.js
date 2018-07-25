'use strict';

const mysql = require('mysql');
const express = require("express");
const bodyParser = require('body-parser');
const childProcess = require('child_process');
const sequential = require('promise-sequential');

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
                reject(error);
            } else {
                resolve(connection);
            }
        });
    });
}

function executeSQL(query, data) {
    return new Promise(function(resolve, reject) {
        getConnection().then((connection) => {
            console.log(query);
            connection.on('error', (error) => reject(error))
            connection.query(query, data, function(error, rows, fields) {
                // setTimeout(()=> {
                    connection.release();
                    if (error) reject(error);
                    else resolve(rows, fields);
                // }, 1000);
            });
        }).catch((error) => reject(error));
    });
}

const concat = (x,y) => x.concat(y)
const flatMap = (f,xs) => xs.map(f).reduce(concat, [])
Array.prototype.flatMap = function(f) { return flatMap(f,this) }

/***********************/
/******* Express *******/
/***********************/

/// Create the Exporess web app
const app = express();
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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

    const dropTasks = tables.map(table => () => executeSQL("DROP TABLE IF EXISTS " + table)).reverse();
    const createTasks = tables.map(table => () => executeSQL(sampleData[table].SQL.create));
    const insertTasks = tables.flatMap(table => () => sampleData[table].data.map(record =>  executeSQL("INSERT INTO " + table + " SET ?", record)));
    

    sequential(dropTasks)
        .then(() => sequential(createTasks))
        .then(() => sequential(insertTasks))
        .then(_ => {
            response.json({"code": 200, "status": "SQL Database populated with `SampleData.json`"})
        }).catch((error) => {
            response.json(error);
        })
})

/// 1. Projection Query
/// Query for all Persons 
app.get("/persons", function(request, response) {
    executeSQL("SELECT * FROM Person")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for Person with specified ID
app.get("/person/:id", function(request, response) {
    const id = request.params.id
    executeSQL("SELECT * FROM Person WHERE id = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for all Seekers 
app.get("/seekers", function(request, response) {
    executeSQL("SELECT * FROM Seeker, Person WHERE Seeker.pid = Person.id")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for Seeker with specified ID
app.get("/seeker/:id", function(request, response) {
    const id = request.params.id
    executeSQL("SELECT * FROM Seeker, Person WHERE Seeker.pid = Person.id AND Seeker.pid = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for all Landlords 
app.get("/landlords", function(request, response) {
    executeSQL("SELECT * FROM Landlord, Person WHERE Landlord.pid = Person.id")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for Seeker with specified ID
app.get("/landlord/:id", function(request, response) {
    const id = request.params.id
    executeSQL("SELECT * FROM Landlord, Person WHERE Landlord.pid = Person.id AND Seeker.pid = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for all Reviews
app.get("/reviews", function(request, response) {
    executeSQL("SELECT * FROM Review")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for Review with specified ID
app.get("/review/:id", function(request, response) {
    const id = request.params.id
    executeSQL("SELECT * FROM Review WHERE rid = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// 7. Delete operation
/// Delete a Review with specified ID
app.delete("/review/:id", function(request, response) {
    const id = request.params.id
    executeSQL("DELETE FROM Review WHERE rid = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// 3. Join Query
/// Query for Reviews on a user with a specified ID
app.get("/reviews/:id", function(request, response) {
    const id = request.params.id
    executeSQL("SELECT * FROM Review r, Person p WHERE r.revieweePID = p.id AND p.id = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// 4. Aggregation query
/// Query for the Average Review score on a Person with a specified ID
app.get("/averageReviewScore/:id", function(request, response) {
    const id = request.params.id
    executeSQL("SELECT p.id, p.name, avg(r.rating) as averageRating FROM Review r, Person p WHERE r.revieweePID = p.id AND p.id = " + id)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// 5. Nested aggregation
/// Query for average review score for each Person
app.get("/ratings", function(request, response) {
    executeSQL("SELECT p.id, p.name, p.gender, p.phoneNumber, p.signUpDate, avg(r.rating) as averageRating FROM Review r, Person p WHERE r.revieweePID = p.id GROUP BY p.id ORDER BY p.id")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for all Locations
app.get("/locations", function(request, response) {
    executeSQL("SELECT * FROM Location")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for all Location in specified city
app.get("/location/:city", function(request, response) {
    const city = request.params.city;
    executeSQL("SELECT * FROM Location WHERE city = " + city)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// 2. Selection Query
/// Query for all Housing
app.get("/housing", function(request, response) {
	var sql;
	const minPrice = request.query.minPrice;
	const maxPrice = request.query.maxPrice;
	if (typeof minPrice === "undefined" && typeof maxPrice === "undefined") {
		sql = "SELECT * FROM Housing";	
	} else if (typeof minPrice !== "undefined" && typeof maxPrice !== "undefined") {
		sql = "SELECT * FROM Housing WHERE price > " + minPrice + " AND price < " + maxPrice;
	} else if (typeof minPrice !== "undefined") {
		sql = "SELECT * FROM Housing WHERE price > " + minPrice;
	} else if (typeof maxPrice !== "undefined") {
		sql = "SELECT * FROM Housing WHERE price < " + maxPrice;
	} else {
		return response.json({"error":"Undefined Query Parameters"});	
	}
    executeSQL(sql)
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// 6. Update Operation
/// Update a Housing price specified by the id
app.post("/housing/:postTitle/:price", function(request, response) {
    const postTitle = request.params.postTitle;
    const price = request.params.price;
    executeSQL("UPDATE Housing SET price = " + price + " WHERE postTitle = '" + postTitle + "'")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// Query for a house with specified title
app.get("/housing/:title", function(request, response) {
    const title = request.params.title
    executeSQL("SELECT * FROM Housing WHERE postTitle = '" + title + "'")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})


/// 7. Delete operation
/// Delete a House with specified title
app.delete("/housing/:title", function(request, response) {
    const title = request.params.title
    executeSQL("DELETE FROM Housing WHERE postTitle = '" + title + "'")
        .then((rows) => {
            response.json(rows);
        }).catch( (error) => { 
            response.json(error);
    });
})

/// 8. Division query
/// Return Persons reviewed by all other persons
app.get("/verifiedReviews", function(request, response) {
    executeSQL("SELECT p1.id, p1.name, p1.gender, p1.phoneNumber, p1.signUpDate, avg(r.rating) as averageRating FROM Review r, Person p1 WHERE r.revieweePID = p1.id AND NOT EXISTS (SELECT * From Person p2 WHERE p2.id != p1.id AND p2.id NOT IN (SELECT DISTINCT r.reviewerPID FROM Review r WHERE r.revieweePID = p1.id)) GROUP BY p1.id ORDER BY p1.id")
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
app.listen(3001, function() {
    console.log('> DormHub API running at localhost:3001');
});