const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const Donor = require("../mongoose-models/donor");
const donorController = require("../controllers/donorController");
const isAuth = require("../middleware/authenticityChecker");

router.get("/home", isAuth, donorController.getDonorHomePage);

router.get("/profile", donorController.getDonorProfilePage);

router.post(
  "/update",
  [
    check("donor-updated-email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body(
      "donor-updated-new-password",
      "Please enter a password with at least 8 characters."
    )
      .isLength({ min: 8 })
      .trim(),
  ],
  donorController.updateProfile
);

router.get(
  "/register-to-camp",
  isAuth,
  donorController.getCampDetailsAndRegistrationPage
);

router.post("/camp/register", isAuth, donorController.registerDonorToCamp);

router.get("/history", donorController.getDonorHistoryPage);

router.get("/linked-hospitals", donorController.getLinkedHospitals);

router.get("/my-requests", donorController.getBloodRequestPage);

router.post("/create-request", donorController.registerRequest);

router.post("/delete-request", donorController.deleteRequest);

router.post(
  "/signin",
  [
    check("donor-signin-email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body(
      "donor-signin-password",
      "Please enter a password with at least 8 characters."
    )
      .isLength({ min: 8 })
      .trim(),
  ],
  donorController.signinDonor
);

router.post(
  "/signup",
  [
    check("donor-signup-email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return Donor.findOne({ email: value }).then((donor) => {
          if (donor) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "donor-signup-password",
      "Please enter a password with at least 8 characters."
    )
      .isLength({ min: 8 })
      .trim(),
  ],
  donorController.signupDoner
);

module.exports = router;
