const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const Admin = require("../mongoose-models/admin");
const Campaign = require("../mongoose-models/campaign");
const Donor = require("../mongoose-models/donor");
const Hospital = require("../mongoose-models/hospital");
const Donation = require("../mongoose-models/donation");
const Request = require("../mongoose-models/request");
const BloodStock = require("../mongoose-models/bloodStock");

exports.getHospitalHomePage = async (req, res, next) => {
  try {
    const hospitalId = req.session.hospitalDetails._id;
    const requestDetails = await Request.find({ requestId: hospitalId });
    const activeRequets =
      (requestDetails != null &&
        Array.isArray(requestDetails) &&
        requestDetails.filter((item) => item.status === "pending")) ||
      0;
    const hospitalData = {
      ...req.session.hospitalDetails,
    };
    if (requestDetails === 0) {
      hospitalData["activeRequests"] = 0;
      hospitalData["totalRequest"] = 0;
    } else {
      hospitalData["activeRequests"] = activeRequets.length;
      hospitalData["totalRequest"] = requestDetails.length;
      hospitalData["latestRequestDetails"] = requestDetails[0];
    }
    res.render("hospital/home", {
      pageTitle: "Hospital Home Page",
      path: "/hospital/home",
      hospitalDetails: hospitalData || null,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getHospitalProfilePage = async (req, res, next) => {
  try {
    const message = req.session.message || "";
    res.render("hospital/profile", {
      pageTitle: "Hospital Profile Page",
      path: "/hospital/profile",
      hospitalDetails: req.session.hospitalDetails || null,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateHospitalProfile = async (req, res, next) => {
  try {
    const hospitalId = req.body["hospital-id"];
    const hospitalDetails = req.session.hospitalDetails;

    const hospital = await Hospital.findById({ _id: hospitalId });
    if (!hospital) {
      return res.render("hospital/profile", {
        pageTitle: "Hospital Profile Page",
        path: "/hospital/profile",
        hospitalDetails: hospitalDetails,
        message: "Hospital not found!",
      });
    }

    hospital.name = req.body["hospital-updated-name"];
    hospital.email = req.body["hospital-updated-email"];
    hospital.mobileNo = req.body["hospital-updated-mobileNo"];
    hospital.address = req.body["hospital-updated-address"];

    if (req.body["hospital-updated-confirm-password"] !== "") {
      const hashedPassword = await bcrypt.hash(
        req.body["hospital-updated-confirm-password"],
        12
      );
      hospital.password = hashedPassword;
    }
    const updatedHospitalDeails = await hospital.save();
    req.session.hospitalDetails = updatedHospitalDeails;
    req.session.message = "Hospital profile updated successfully!";
    res.redirect("/hospital/profile");
  } catch (error) {
    console.log(error);
  }
};

exports.getBloodRequestPage = async (req, res, next) => {
  try {
    const hospitalId = req.session.hospitalDetails._id;
    const requestDetails = await Request.find({ requestId: hospitalId });
    if (requestDetails != null && requestDetails.length > 0) {
      res.render("hospital/requests", {
        pageTitle: "Blood Requests Details",
        path: "/hospital/requests",
        view: req.query.view || "viewRequests",
        requestDetails: requestDetails,
      });
    } else {
      res.render("hospital/requests", {
        pageTitle: "Blood Requests Details",
        path: "/hospital/requests",
        view: req.query.view || "viewRequests",
        requestDetails: [],
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.registerRequest = async (req, res, next) => {
  try {
    const requestType = "hospital";
    const requestId = req.session.hospitalDetails._id;
    const bloodGroup = req.body.bloodGroup;
    const units = req.body.units;
    const priority = req.body.priority;
    const status = "pending";
    const date = new Date().toISOString().split("T")[0];

    const request = new Request({
      requestType: requestType,
      requestId: requestId,
      bloodGroup: bloodGroup,
      units: units,
      priority: priority,
      status: status,
      date: date,
    });
    const requestSaveResult = await request.save();
    if (requestSaveResult) {
      res.redirect("/hospital/requests");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteRequest = async (req, res, next) => {
  try {
    const requestId = req.body.requestId;
    const deleteRequestResults = await Request.findOneAndDelete({
      _id: requestId,
    });
    if (deleteRequestResults) {
      res.redirect("/hospital/requests");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.signupHospital = async (req, res, next) => {
  try {
    const hospitalName = req.body["hospital-signup-name"];
    const hospitalEmail = req.body["hospital-signup-email"];
    const hospitalMobile = req.body["hospital-signup-mobile"];
    const hospitalAddress = req.body["hospital-signup-address"];
    const hospitalPassword = req.body["hospital-signup-password"];

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/donorLogin", {
        path: "/auth/hospital/signup",
        pageTitle: "Hospital Signup",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name: hospitalName,
          email: hospitalEmail,
          mobileNo: hospitalMobile,
          address: hospitalAddress,
          password: hospitalPassword,
        },
        view: "signup",
      });
    }

    bcrypt
      .hash(hospitalPassword, 12)
      .then((hashedPassword) => {
        const hospital = new Hospital({
          name: hospitalName,
          email: hospitalEmail,
          mobileNo: hospitalMobile,
          address: hospitalAddress,
          password: hashedPassword,
        });
        return hospital.save();
      })
      .then((result) => {
        res.redirect("/auth/hospital/signin");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

exports.signinHospital = async (req, res, next) => {
  try {
    const hospitalMail = req.body["hospital-signin-email"];
    const hospitalPassword = req.body["hospital-signin-password"];

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/hospitalLogin", {
        path: "/auth/hospital/signin",
        pageTitle: "Hospital Signin",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: hospitalMail,
          password: hospitalPassword,
        },
        view: "signin",
      });
    }

    await Hospital.findOne({ email: hospitalMail }).then((hospital) => {
      if (!hospital) {
        return res.status(422).render("auth/hospitalLogin", {
          path: "/auth/hospital/signin",
          pageTitle: "Hospital Signin",
          errorMessage: "Invalid email or password",
          oldInput: {
            email: hospitalMail,
            password: hospitalPassword,
          },
          view: "signin",
        });
      }

      bcrypt.compare(hospitalPassword, hospital.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.hospitalDetails = hospital;
          return req.session.save((error) => {
            if (error) {
              console.log("ERROR WHILE SAVING SESSION", error);
            }
            res.redirect("/hospital/home");
          });
        }

        return res.status(422).render("auth/hospitalLogin", {
          path: "/auth/hospital/signin",
          pageTitle: "Hospital Signin",
          errorMessage: "Invalid email or password",
          oldInput: {
            email: hospitalMail,
            password: hospitalPassword,
          },
          view: "signin",
        });
      });
    });
  } catch (error) {
    req.session.message = "Something went wrong!";
    res.redirect("/login");
  }
};
