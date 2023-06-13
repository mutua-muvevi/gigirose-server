//package imports
const express = require("express");
const router = express.Router();

//custom module imports
const { post, editById, fetchAll, fetchOne, deleteUser } = require("../controller/user");
const { upload } = require("../utils/multer");

//routes
// create
router.route("/post").post(upload.single("picture"), post);

//update
router.route("/edit/:id").put(editById);

//read
router.route("/get/all").get(fetchAll);
router.route("/get/one/:id").get(fetchOne)

//delete user
router.route("/delete/:id").delete(deleteUser)

//export
module.exports = router