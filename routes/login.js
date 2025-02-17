const express = require("express");
const router = express.Router();

const loginController = require("../controllers/loginController");

router.get("/donor/signin", loginController.renderDonorSigninPage);

router.get("/donor/signup", loginController.renderDonorSignupPage);

router.get("/admin/signin", loginController.renderAdminSigninPage);

router.get("/hospital/signin", loginController.renderHospitalSigninPage);

router.get("/hospital/signup", loginController.renderHospitalSignupPage);

module.exports = router;
