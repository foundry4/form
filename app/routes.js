const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
// landing page
router.get("/submit", function (req, res, next) {
    console.log("submit");
    console.log(req.session.data);
    
    res.render("confirm", {
      });
});



module.exports = router
