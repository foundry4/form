const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
var devices = [
    "Air Compressors / Pumps",
    "Bellows",
    "Self-inflating bags",
    "Gas mixing valves",
    "Pressure Regulators",
    "Flow Control valves",
    "Solenoid valves",
    "Pressure relief valves",
    "Check valves / one-way valves",
    "Industrial Automation components (Safety Relays, PLCs)",
    "Power Supplies",
    "Electric Motors, and motor controllers",
    "Linear actuators and controllers",
    "Tubing and fittings",
    "Pressure Sensors and Indicators",
    "Oxygen Sensors and Indicators",
    "Flow Sensors and Indicators",
    "Manometers",
    "Heat and moisture exchanging filters (HMEFs)",
    "Air Filter, HEPA Filters"
];

var expertise = [
    "Design / specification",
    "Rapid prototyping",
    "Manufacturing (manual)",
    "Manufacturing (automated)",
    "Machine Shops/sheet metal/tool manufacture",
    "Pneumatic part manufacturers/suppliers",
    "Contract/Product Assembly",
    "Certification/regulation/testing",
    "Logistics",
    "Medical Training"
];

var resources = [
    "Suitable space",
    "Equipment",
    "Trained personnel",
    "Other",
];

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
    
    // pullout specific BASIC vars
    var companyName = data['organisation-name'] || "";
    var companyNumber = data['company-number'] || "";
    var contact = data['primary-contact'] || "";
    var role = data['primary-contact-role'] || "";
    var phone = data['phone'] || "";
    var email = data['email'] || "";

    // SUPPLY CHAIN
    var isClinical = data['is-clinical'] || "no";
    var isHumanUse= data['human-use'] || "no";
    var isVetUse= data['vet-use'] || "no";
    var isOtherUse= data['other-use'] || "no";
    // freetext
    var ventilatorText = data['ventilator-detail'] || "";
    //console.log(isClinical, isHumanUse, isVetUse, isOtherUse, ventilatorText);

    // MEDICAL DEVICES
    var med_devices = {};
    // loop thru design
    if (data['design']) {
        let len = data['design'].length;
        for (var i = 0; i < len; i++) {
            //convert name to string
            var name = data['design'][i].split(" /")[0];
            name = name.split("(")[0];
            name = name.split(",")[0];
            name = name.split(" and")[0];
            name = name.split("-").join("_");
            name = name.split(" ").join("_") + "_design";
            name = name.split("__").join("_").toLowerCase();
            med_devices[name] = "yes";
        }
    }
    if (data['manufacture']) {
        let len = data['manufacture'].length;
        for (var i = 0; i < len; i++) {
            //convert name to string
            var name = data['manufacture'][i].split(" /")[0];
            name = name.split("(")[0];
            name = name.split(",")[0];
            name = name.split(" and")[0];
            name = name.split("-").join("_");
            name = name.split(" ").join("_") + "_manufacture";
            name = name.split("__").join("_").toLowerCase();
            med_devices[name] = "yes";
        }
    }
    if (data['supply']) {
        let len = data['supply'].length;
        for (var i = 0; i < len; i++) {
            //convert name to string
            var name = data['supply'][i].split(" /")[0];
            name = name.split("(")[0];
            name = name.split(",")[0];
            name = name.split(" and")[0];
            name = name.split("-").join("_");
            name = name.split(" ").join("_") + "_supply";
            name = name.split("__").join("_").toLowerCase();
            med_devices[name] = "yes";
        }
    }
    // get locations
    for (var i = 1; i < 21; i++) {
        var ref = 0;
        if (data['location-' + i] !== "") {
            var name = devices[i - 1].split("/")[0];
            name = name.split("(")[0];
            name = name.split(",")[0];
            name = name.split(" and")[0];
            name = name.split("-").join("_");
            name = name.split(" ").join("_") + "_location";
            name = name.split("__").join("_").toLowerCase();
            ref = parseInt(data['location-' + i]);
            med_devices[name] = ref;
        }

    }
    //console.log(med_devices);


    // Q5
    // freetext
    var offerText = data['offer'] || "";

    // SKILLS and SPECIALISM
    var cats = {};
    // loop thru skillz
    if (data['skills']) {
        let len = data['skills'].length;
        for (var i = 0; i < len; i++) {
            //convert name to string
            var name = data['skills'][i].split("/")[0];
            name = name.split("(").join("");
            name = name.split(")").join("");
            name = name.split(" ").join("_") + "_skills";
            name = name.split("__").join("_").toLowerCase();
            cats[name] = "yes";
        }
    }
    //var specialism = [];
    if (data['specialism']) {
        let len = data['specialism'].length;
        for (var i = 0; i < len; i++) {
            //convert name to string
            var name = data['specialism'][i].split("/")[0];
            name = name.split("(").join("");
            name = name.split(")").join("");
            name = name.split(" ").join("_") + "_specialism";
            name = name.split("__").join("_").toLowerCase();
            cats[name] = "yes";
        }
    }
    // get locations
    for (var i = 1; i < 11; i++) {
        var ref = 0;
        if (data['specialism-location-' + i] !== "") {
            var name = expertise[i - 1].split("/")[0];
            name = name.split("(").join("");
            name = name.split(")").join("");
            name = name.split(" ").join("_") + "_location";
            name = name.split("__").join("_").toLowerCase();
            ref = parseInt(data['specialism-location-' + i]);
            cats[name] = ref;
        }

    }
    //console.log(cats);


    // Q7
    var resources = [];
    var resources_space = "";
    var resources_equipment = "";
    var resources_personnel = "";
    var resources_other = "";
    if (data['resources']) {
        console.log(data['resources']);
        let len = data['resources'].length;
        for (var i = 0; i < len; i++) {
            console.log( data['resources'][i]);
            if(data['resources'][i]==="Suitable space"){
                resources_space="yes";
            }
            if(data['resources'][i]==="Equipment"){
                resources_equipment="yes";
            }
            if(data['resources'][i]==="Trained personnel"){
                resources_personnel="yes";
            }
            if(data['resources'][i]==="Other"){
                resources_other="yes";
            }

        }
    }
    // freetext
    var resourcesText = data['resources-detail'] || "";
    //console.log(resources, resourcesText);

    var deviceFields = "";
    var devicesResults = "";
    for (item in med_devices) {
        deviceFields += item + ", ";
    }
    for (item in med_devices) {
        devicesResults += "'" + med_devices[item] + "', ";
    }

    var json = JSON.stringify(req.session.data);
    var sql_values = {
        "info" : json, 
        "company_name" : companyName, 
        "company_number" : companyNumber, 
        "contact_name" : contact, 
        "contact_role" : role, 
        "contact_phone" : phone, 
        "contact_email" : email, 
        "ventilator_production" : isClinical, 
        "ventilator_parts_human" : isHumanUse, 
        "ventilator_parts_veterinary" : isVetUse, 
        "ventilator_parts_any" : isOtherUse, 
        "ventilator_parts_details" : ventilatorText,
        "offer_organisation" : offerText,
        "resources_space" : resources_space, 
        "resources_equipment" : resources_equipment, 
        "resources_personnel" : resources_personnel, 
        "resources_other" : resources_other, 
        "resource_details" : resourcesText
    }

    // Add in fields from med_devices
    var med_keys = Object.keys(med_devices)
    for (var i = 0; i < med_keys.length; i++) {
        key = med_keys[i]
        sql_values[key] = med_devices[key]
    }

    // Add in fields from cats
    var cat_keys = Object.keys(cats)
    for (var i = 0; i < cat_keys.length; i++) {
        key = cat_keys[i]
        sql_values[key] = cats[key]
    }

    // Quick check
    console.log(sql_values)

    // Build arrays of entries for the SQL query
    var fieldNames = [];
    var valuePositions = [];
    var values = [];
    var sql_keys = Object.keys(sql_values)
    for (var i = 0; i < sql_keys.length; i++) {
        key = sql_keys[i]
        fieldNames.push(key)
        valuePositions.push("$"+i)
        values.push(values[key])
    }

    var fields = fieldNames.join(", ")
    var positions = valuePositions.join(", ")
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
