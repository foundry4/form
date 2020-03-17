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

router.get("/submit", function (req, res, next) {

    var data = req.session.data;
    
    // pullout specific BASIC vars
    var companyName = "";
    if (data['organisation-name']) {
        companyName = data['organisation-name'];
    }
    var companyNumber = "";
    if (data['company-number']) {
        companyNumber = data['company-number'];
    }
    var contact = "";
    if (data['primary-contact']) {
        contact = data['primary-contact'];
    }
    var role = "";
    if (data['primary-contact-role']) {
        role = data['primary-contact-role'];
    }
    var phone = "";
    if (data['phone']) {
        phone = data['phone'];
    }
    var email = "";
    if (data['email']) {
        email = data['email'];
    }

    // SUPPLY CHAIN
    var isClinical = "no";
    if (data['is-clinical']) {
        isClinical = data['is-clinical'];
    }
    var isHumanUse = "no";
    if (data['human-use']) {
        isHumanUse = data['human-use'];
    }
    var isVetUse = "no";
    if (data['vet-use']) {
        isVetUse = data['vet-use'];
    }
    var isOtherUse = "no";
    if (data['other-use']) {
        isOtherUse = data['other-use'];
    }

    // freetext
    var ventilatorText = "";
    if (data['ventilator-detail']) {
        ventilatorText = data['ventilator-detail'];
        ventilatorText = ventilatorText.substring(0, 999);
    }
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
    var offerText = [];
    if (data['offer']) {
        offerText = data['offer'];
        offerText = offerText.substring(0, 999);
    }

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
    var resourcesText = [];
    if (data['resources-detail']) {
        resourcesText = data['resources-detail'];
        resourcesText = resourcesText.substring(0, 999);
    }
    //console.log(resources, resourcesText);

    var deviceFields = "";
    var devicesResults = "";
    for (item in med_devices) {
        deviceFields += item + ", ";
    }
    for (item in med_devices) {
        devicesResults += "'" + med_devices[item] + "', ";
    }

    var catFields = "";
    var catResults = "";
    for (item in cats) {
        catFields += item + ", ";
    }
    for (item in cats) {
        catResults += "'" + cats[item] + "', ";
    }

    // time stamp
    var time = + new Date();
    // add to json
    //req.session.data.timestamp = time;

    var json = JSON.stringify(req.session.data);

 
    var SQL = `INSERT INTO companies(
        company_name, company_number, contact_name, contact_role, contact_phone, contact_email, 
        ventilator_production, ventilator_parts_human, ventilator_parts_veterinary, ventilator_parts_any, ventilator_parts_details,
        ${deviceFields}
        offer_organisation,
        ${catFields}
        resources_space, resources_equipment, resources_personnel, resources_other, resource_details,
        timestamp
        ) VALUES (
            '${companyName}', '${companyNumber}', '${contact}', '${phone}', '${email}', 
            '${isClinical}', '${isHumanUse}', '${isVetUse}', '${isOtherUse}',' ${ventilatorText}',
            ${devicesResults}
            '${offerText}',
            ${catResults}
            '${resources_space}', '${resources_equipment}', '${resources_personnel}', '${resources_other}', '${resourcesText}',
            '${time}'
        );`;
 
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
        console.log(SQL);
                 
        const client = new Client({
            connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
            ssl: true,
            });
            
        client.connect();
    
        client.query(SQL, (err, res) => {
            client.end();
            if (err) next(err);
        });
         
    } else {
        console.log('nothing to see');

    }
    


    res.render("confirm", {
    });
});



module.exports = router
