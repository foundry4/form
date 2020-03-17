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
    var name = "";
    if(data['organisation-name']){
        name = data['organisation-name'];
    }
    var number = "";
    if(data['company-number']){
        number = data['company-number'];
    }
    var contact = "";
    if(data['primary-contact']){
        contact = data['primary-contact'];
    }
    var role = "";
    if(data['primary-contact-role']){
        role = data['primary-contact-role'];
    }
    var phone = "";
    if(data['phone']){
        phone = data['phone'];
    }
    var email = "";
    if(data['email']){
        email = data['email'];
    }

    //console.log(name, number ,contact, phone, email);
    // SUPPLY CHAIN

    var isClinical = "no";
    if(data['is-clinical']){
        isClinical = data['is-clinical'];
    }
    var isHumanUse = "no";
    if(data['human-use']){
        isHumanUse = data['human-use'];
    }
    var isVetUse = "no";
    if(data['vet-use']){
        isVetUse = data['vet-use'];
    }
    var isOtherUse = "no";
    if(data['other-use']){
        isOtherUse = data['other-use'];
    }

    // freetext
    var ventilatorText = "";
    if(data['ventilator-detail']){
        ventilatorText = data['ventilator-detail'];
    }
    //console.log(isClinical, isHumanUse, isVetUse, isOtherUse, ventilatorText);

    // MEDICAL DEVICES
    var med_devices = { };
    // loop thru design
    if(data['design']){
        let len = data['design'].length;
        for ( var i=0; i<len; i++){
            //convert name to string
            var name = data['design'][i].split(" /")[0];
            name = name.split("(")[0];
            name = name.split(",")[0];
            name = name.split(" and")[0];
            name = name.split("-").join("_");
            name = name.split(" ").join("_")+"_design";
            name = name.split("__").join("_").toLowerCase();
            med_devices[name] = "yes";
        }
    }
    if(data['manufacture']){
        let len = data['manufacture'].length;
        for ( var i=0; i<len; i++){
            //convert name to string
            var name = data['manufacture'][i].split(" /")[0];
            name = name.split("(")[0];
            name = name.split(",")[0];
            name = name.split(" and")[0];
            name = name.split("-").join("_");
            name = name.split(" ").join("_")+"_manufacture";
            name = name.split("__").join("_").toLowerCase();
            med_devices[name] = "yes";
        }
    }
    if(data['supply']){
        let len = data['supply'].length;
        for ( var i=0; i<len; i++){
            //convert name to string
            var name = data['supply'][i].split(" /")[0];
            name = name.split("(")[0];
            name = name.split(",")[0];
            name = name.split(" and")[0];
            name = name.split("-").join("_");
            name = name.split(" ").join("_")+"_supply";
            name = name.split("__").join("_").toLowerCase();
            med_devices[name] = "yes";
        }
    }
    // get locations
    for ( var i=1; i<21; i++){
        var ref = 0;
        if(data['location-'+i]!==""){
            var name = devices[i-1].split("/")[0];
            name = name.split("(")[0];
            name = name.split(",")[0];
            name = name.split(" and")[0];
            name = name.split("-").join("_");
            name = name.split(" ").join("_")+"_location";
            name = name.split("__").join("_").toLowerCase();
            ref = parseInt(data['location-'+i]);
            med_devices[name] = ref;
        }
        
    }

    console.log(med_devices);
    

    // get locations - build an array
    var location = [];
    for ( var i=1; i<21; i++){
        var ref = 0;
        if(data['location-'+i]!==""){
            ref = parseInt(data['location-'+i]);
        }
        location.push(ref);
    }
    //console.log(design, manufacture, supply);
    //console.log(location);

    // Q5
    // freetext
    var offerText = [];
    if(data['offer']){
        offerText = data['offer'];
    }

    // SKILLS and SPECIALISM
    var cats = { };
    // loop thru skillz
    if(data['skills']){
        let len = data['skills'].length;
        for ( var i=0; i<len; i++){
            //convert name to string
            var name = data['skills'][i].split("/")[0];
            name = name.split(" ").join("_")+"_skills";
            name = name.split("__").join("_").toLowerCase();
           //console.log(data['skills'][i], name);
            cats[name] = "yes";
        }
    }
    //var specialism = [];
    if(data['specialism']){
        let len = data['specialism'].length;
        for ( var i=0; i<len; i++){
            //convert name to string
            var name = data['specialism'][i].split("/")[0];
            name = name.split(" ").join("_")+"_specialism";
            name = name.split("__").join("_").toLowerCase();
            //console.log(data['specialism'][i], name);
            cats[name] = "yes";
        }
    }
    // get locations
    for ( var i=1; i<11; i++){
        var ref = 0;
        if(data['specialism-location-'+i]!==""){
            var name = expertise[i-1].split("/")[0];
            name = name.split(" ").join("_")+"_location";
            name = name.split("__").join("_").toLowerCase();
            ref = parseInt(data['specialism-location-'+i]);
            cats[name] = ref;
        }
        
    }
    //console.log(cats);


    // Q7
    var resources = [];
    if(data['resources']){
        resources = data['resources'];
    }
    // freetext
    var resourcesText = [];
    if(data['resources-detail']){
        resourcesText = data['resources-detail'];
    }
    //console.log(resources, resourcesText);
/*     
    var SQL = `INSERT INTO companies(
        name, number, contact, phone, email, 
        isClinical, isHumanUse, isVetUse, isOtherUse, ventilatorText,
        design, manufacture, supply, location,
        offerText,
        skills, specialism, specialismLocation, resources, resourcesText
        ) VALUES (
            '${name}', '${number}', '${contact}', '${phone}', '${email}', 
            '${isClinical}', '${isHumanUse}', '${isVetUse}', '${isOtherUse}',' ${ventilatorText}',
            '${design}', '${manufacture}', '${supply}',' ${location}',
            '${offerText}',
            '${skills}', '${specialism}', '${specialismLocation}', '${resources}', '${resourcesText}'
        );`;
 */

var json = JSON.stringify(req.session.data);
// check for data
if (json.length>2){
    
    var SQL = "INSERT INTO companies(info) VALUES ('"+json+"');";
    console.log(SQL);
}else{
    console.log('nothing to see');
    
}
/* 

 
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      });
      
    client.connect();

    client.query(SQL, (err, res) => {
        if (err) throw err;
        
        //console.log(res);
        client.end();
      });
 */
 
    res.render("confirm", {
      });
});



module.exports = router
