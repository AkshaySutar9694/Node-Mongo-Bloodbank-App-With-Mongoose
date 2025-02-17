const express = require("express");
const { check, body } = require("express-validator");
const Hospital = require("../mongoose-models/hospital");
const router = express.Router();

const hospitalController = require("../controllers/hospitalController");

router.get("/home", hospitalController.getHospitalHomePage);

router.get("/profile", hospitalController.getHospitalProfilePage);

router.post(
  "/update-profile",
  [
    check("hospital-updated-email")
      .isEmail()
      .withMessage("Please enter a valid email."),
    body(
      "hospital-updated-new-password",
      "Please enter a password with at least 8 characters."
    )
      .isLength({ min: 8 })
      .trim(),
  ],
  hospitalController.updateHospitalProfile
);

router.get("/requests", hospitalController.getBloodRequestPage);

router.post("/create-request", hospitalController.registerRequest);

router.post("/delete-request", hospitalController.deleteRequest);

router.post(
  "/signup",
  [
    check("hospital-signup-email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Hospital.findOne({ email: value }).then((donor) => {
          if (donor) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      }),
    body(
      "hospital-signup-password",
      "Please enter a password with at least 8 characters."
    )
      .isLength({ min: 8 })
      .trim(),
  ],
  hospitalController.signupHospital
);

router.post(
  "/signin",
  [
    check("hospital-signin-email")
      .isEmail()
      .withMessage("Please enter a valid email."),
    body(
      "hospital-signin-password",
      "Please enter a password with at least 8 characters."
    )
      .isLength({ min: 8 })
      .trim(),
  ],
  hospitalController.signinHospital
);

module.exports = router;
