//package imports
const express = require("express");
const router = express.Router();

//custom module imports
const { register, editById, fetchAll, fetchOne, deleteUser, login, forgotPassword, resetpassword, fetchMe } = require("../controller/user");
const { authMiddleware } = require("../middleware/auth");
const { getMe } = require("../middleware/me");

//routes
// create
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword").post(resetpassword);

//update
router.route("/edit/:id").put(editById);

//read
router.route("/get/all").get(fetchAll);
router.route("/get/one/:id").get(fetchOne)
router.route("/me").get(authMiddleware, getMe, fetchMe)

//delete user
router.route("/delete/:id").delete(deleteUser)

//export
module.exports = router