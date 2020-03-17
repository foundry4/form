const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
var categories = [
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
    "Power Supplies ",
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
        categories: categories,
        expertise: expertise,
        resources: resources
      });
});

router.get("/submit", function (req, res, next) {
    console.log("submit");
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

    console.log(name, number ,contact, phone, email);
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
    console.log(isClinical, isHumanUse, isVetUse, isOtherUse, ventilatorText);

    // MEDICAL DEVICES
    var design = [];
    if(data['design']){
        design = data['design'];
    }
    var manufacture = [];
    if(data['manufacture']){
        manufacture = data['manufacture'];
    }
    var supply = [];
    if(data['supply']){
        supply = data['supply'];
    }

    
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
    console.log(location);

    // Q5
    // freetext
    var offerText = [];
    if(data['offer']){
        offerText = data['offer'];
    }

    // SKILLS and SPECIALISM
    var skills = [];
    if(data['skills']){
        skills = data['skills'];
    }
    var specialism = [];
    if(data['specialism']){
        specialism = data['specialism'];
    }
    // get locations - build an array
    var specialismLocation = [];
    for ( var i=1; i<11; i++){
        var ref = 0;
        if(data['specialism-location-'+i]!==""){
            ref = parseInt(data['specialism-location-'+i]);
        }
        specialismLocation.push(ref);
    }
console.log(specialismLocation);

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
    console.log(resources, resourcesText);
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
    var SQL = "INSERT INTO companies(info) VALUES ('"+json+"');";


    console.log(SQL);
 
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
 
    res.render("confirm", {
      });
});



module.exports = router
