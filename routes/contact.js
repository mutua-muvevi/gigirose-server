//package imports
const express = require("express");
const router = express.Router();

//custom module imports
const { post, fetchAll, deleteContact } = require("../controller/contact");

//routes
// create
router.route("/post").post(post);
router.route("/fetchAll").get(fetchAll);
router.route("/delete/:id").delete(deleteContact);

//export
module.exports = router