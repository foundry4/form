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
    console.log(req.session.data);
    
    res.render("confirm", {
      });
});



module.exports = router
