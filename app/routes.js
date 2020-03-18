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

router.get("/submit", function (req, res, next) {

    var data = req.session.data;
    const {fields, positions,json,values} = createData(data);
    var sql = "INSERT INTO companies(" + fields + ") VALUES (" + positions + ");"

    // var catFields = "";
    // var catResults = "";
    // for (item in cats) {
    //     catFields += item + ", ";
    // }
    // for (item in cats) {
    //     catResults += "'" + cats[item] + "', ";
    // }

    // // time stamp
    // var time = + new Date();
    // // add to json
    // //req.session.data.timestamp = time;

    // var companyName
    // '${companyNumber}',
    // '${contact}',
    // '${role}',
    // '${phone}',
    // '${email}',
    // '${isClinical}',
    // '${isHumanUse}',
    // '${isVetUse}',
    // '${isOtherUse}',
    // '${ventilatorText}',
    // ${devicesResults}
    // '${offerText}',
    // ${catResults}
    // '${resources_space}',
    // '${resources_equipment}',
    // '${resources_personnel}',
    // '${resources_other}',
    // '${resourcesText}'

    // var SQL = `INSERT INTO companies(
    //     info,
    //     company_name,
    //     company_number,
    //     contact_name,
    //     contact_role,
    //     contact_phone,
    //     contact_email,
    //     ventilator_production,
    //     ventilator_parts_human,
    //     ventilator_parts_veterinary,
    //     ventilator_parts_any,
    //     ventilator_parts_details,
    //     ${deviceFields}
    //     offer_organisation,
    //     ${catFields}
    //     resources_space,
    //     resources_equipment,
    //     resources_personnel,
    //     resources_other,
    //     resource_details
    //     ) VALUES (
    //         '${json}',
    //         '${companyName}',
    //         '${companyNumber}',
    //         '${contact}',
    //         '${role}',
    //         '${phone}',
    //         '${email}',
    //         '${isClinical}',
    //         '${isHumanUse}',
    //         '${isVetUse}',
    //         '${isOtherUse}',
    //         '${ventilatorText}',
    //         ${devicesResults}
    //         '${offerText}',
    //         ${catResults}
    //         '${resources_space}',
    //         '${resources_equipment}',
    //         '${resources_personnel}',
    //         '${resources_other}',
    //         '${resourcesText}'
    //     );`;

    /*
    ventilator_production isClinical
    ventilator_parts_human isHumanUse
    ventilator_parts_veterinary isVetUse
    ventilator_parts_any isOtherUse
    ventilator_parts_details ventilatorText
    */

    // check for data
    if (json.length > 2) {
        //var SQL = "INSERT INTO companies(info) VALUES ('"+json+"');";

        const query = {
            text: sql,
            values: values,
        }
        console.log(query);

        const client = new Client({
            connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
            ssl: true,
        });

        client.connect();

        client.query(query, (err, res) => {
            client.end();
            if (err) next(err);
        });

    } else {
        console.log('nothing to see');

    }

    res.render("confirm", {
    });
});


// sanitize = function (string){
//     const map = {
//         '&': '&amp;',
//         '<': '&lt;',
//         '>': '&gt;',
//         '"': '&quot;',
//         "'": '&#x27;', 
//         "/": '&#x2F;',
//     };
//     const reg = /[&<>"'/]/ig;
//     return string.replace(reg, (match)=>(map[match]));
//   }


module.exports = router