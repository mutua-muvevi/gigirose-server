//package imports
const express = require("express");
const router = express.Router();

//custom module imports
const { post, fetchAll, deleteBook } = require("../controller/booking");

//routes
// create
router.route("/post").post(post);
router.route("/fetchAll").get(fetchAll);
router.route("/delete/:id").delete(deleteBook);

//export
module.exports = router