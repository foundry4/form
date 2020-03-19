const express = require('express')
const router = express.Router()
const createData = require('../lib/createData');
// Add your routes here - above the module.exports line
var {devices, expertise, resources} = require('../lib/constants');

const { Client } = require('pg');

// landing page
router.get("/", function (req, res, next) {
    res.render("index", {
        devices: devices,
        expertise: expertise,
        resources: resources
    });
});

router.get('/error', function(req, res, next) {
    res.render('error', { content : {error: {message: "Internal server error"}}});
});

router.post("/submit", function (req, res, next) {
    try{
        var data = req.session.data;
        const { fields, positions, json, values } = createData(data);
        var sql = "INSERT INTO companies(" + fields + ") VALUES (" + positions + ");"

        console.log(sql);

        // check for data
        console.log("check json " + json.length);

        console.log("check json " + json.length);

        const query = {
            text: sql,
            values: values,
        }
        // query["text"] = "INSERT INTO companies( info ) values ( $1 )"
        // query["values"] = [json]

        console.log(query);
        try {

        const client = new Client({
            connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
            ssl: true,
        });

           client.connect();
       }
       catch(errr){
            throw new err('Failed to connect to database')
        }
        console.log("connect");

        client.query(query, (err, res) => {
            console.log(res);

            client.end();
            if (err) next(err);
        });

        res.render("confirm", {
        });
    }
    catch(err){
        res.render('error', { content : {error: {message: "Internal server error"}}});
    }

});

router.get("/submit", function (req, res, next) {
    res.render("confirm", {});
});

module.exports = router