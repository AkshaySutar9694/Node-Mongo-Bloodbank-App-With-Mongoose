const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/home", adminController.getAdminHomePage);

router.get("/blood-bank-folio", adminController.getBloodBankInventoryDetails);

router.get("/camps", adminController.getCampDetails);

router.post(
  "/camps/registerCamp",
  [
    check("campName").notEmpty(),
    check("location").notEmpty().trim(),
    check("date")
      .notEmpty()
      .withMessage("Date is required")
      .trim()
      .isISO8601()
      .withMessage("Invalid date format") // Ensures the date is in ISO 8601 format
      .custom((value) => {
        const inputDate = new Date(value);
        const today = new Date();
        const normalizedInputDate = new Date(
          inputDate.getFullYear(),
          inputDate.getMonth(),
          inputDate.getDate()
        );
        const normalizedToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        if (normalizedInputDate < normalizedToday) {
          throw new Error("Date must be greater than today");
        }
        return true;
      }),
  ],
  adminController.registerCamp
);

router.put(
  "/camps/updateCamp/:id",
  [
    check("name").notEmpty(),
    check("location").notEmpty().trim(),
    check("date")
      .notEmpty()
      .withMessage("Date is required")
      .trim()
      .isISO8601()
      .withMessage("Invalid date format") // Ensures the date is in ISO 8601 format
      .custom((value) => {
        const inputDate = new Date(value);
        const today = new Date();
        const normalizedInputDate = new Date(
          inputDate.getFullYear(),
          inputDate.getMonth(),
          inputDate.getDate()
        );
        const normalizedToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        if (normalizedInputDate < normalizedToday) {
          throw new Error("Date must be greater than today");
        }
        return true;
      }),
  ],
  adminController.updateCampDetails
);

router.delete("/camps/deleteCamp/:id", adminController.deleteCamp);

router.get("/camps/:id/donors", adminController.getDonorsRegisteredToCamp);

router.get("/camps/:id/donations", adminController.getRecordDonationPage);

router.post("/camps/:id/record-donation", adminController.recordDonations);

router.get("/donorDetails", adminController.getAllDonorDetails);

router.post(
  "/donorDetails/getDonationDetails",
  adminController.getDonorsDonationDetails
);

router.post(
  "/donorDetails/getRequestDetails",
  adminController.getDonorsRequestDetails
);

router.get("/hospitals", adminController.getAllHospitalDetails);

router.post(
  "/hospitalDetails/getRequestDetails",
  adminController.getHospitalsRequestDetails
);

router.get("/requests", adminController.getRequestProcessingPage);

router.get("/donor-details/:id", adminController.getDonorDetailsById);

router.get("/hospital-details/:id", adminController.getHospitalDetailsById);

router.post("/process-request", adminController.processRequest);

router.post(
  "/signin",
  [
    check("admin-signin-username").notEmpty(),
    body("admin-signin-password").notEmpty().trim(),
  ],
  adminController.signinAdmin
);

module.exports = router;
