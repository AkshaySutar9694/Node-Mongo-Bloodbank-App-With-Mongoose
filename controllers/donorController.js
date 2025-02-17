const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const Donor = require("../mongoose-models/donor");
const Campaign = require("../mongoose-models/campaign");
const Hospital = require("../mongoose-models/hospital");
const Donation = require("../mongoose-models/donation");
const Request = require("../mongoose-models/request");

exports.getDonorHomePage = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const donorId = req.session.donorDetails._id;
    const campDetails = await Campaign.geCampDetails({
      date: { $gte: today }, // Get camps with dates greater than or equal to today
      participants: { $ne: donorId }, // Exclude camps where donor is a participant
    });
    res.render("donor/home", {
      pageTitle: "Donor Home Page",
      path: "/donor/home",
      donorDetails: req.session.donorDetails,
      latestCampDetails:
        campDetails != null &&
        Array.isArray(campDetails) &&
        campDetails.length > 0
          ? campDetails[0]
          : null,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getDonorProfilePage = async (req, res, next) => {
  try {
    const donorDetails = req.session.donorDetails;
    const message = req.session.message || "";
    req.session.message = null;
    res.render("donor/profile", {
      pageTitle: "Donor Profile Page",
      path: "/donor/profile",
      donorDetails: donorDetails,
      message: message,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const donorDetails = req.session.donorDetails;
    const message = req.session.message || "";

    const donor = await Donor.findById(donorDetails._id);

    if (!donor) {
      return res.render("donor/profile", {
        pageTitle: "Donor Profile Page",
        path: "/donor/profile",
        donorDetails: donorDetails,
        message: "Donor not found!",
      });
    }
    donor.name = req.body["donor-updated-name"];
    donor.age = req.body["donor-updated-age"];
    donor.email = req.body["donor-updated-email"];
    donor.mobileno = req.body["donor-updated-mobileno"];
    donor.address = req.body["donor-updated-address"];
    if (req.body["donor-updated-confirm-password"] !== "") {
      const hashedPassword = await bcrypt.hash(
        req.body["donor-updated-confirm-password"],
        12
      );
      donor.password = hashedPassword;
    }

    const updatedDonor = await donor.save();
    req.session.donorDetails = updatedDonor;
    req.session.message = "Donor profile updated successfully!";
    res.redirect("/donor/profile");
  } catch (error) {
    console.error("Error updating profile:", error);
    res.render("donor/profile", {
      pageTitle: "Donor Profile Page",
      path: "/donor/profile",
      donorDetails: req.session.donorDetails,
      message: "Something went wrong!",
    });
  }
};

exports.getCampDetailsAndRegistrationPage = async (req, res, next) => {
  try {
    const donorId = req.session.donorDetails._id;
    const today = new Date().toISOString().split("T")[0];
    const campDetails = await Campaign.geCampDetails({
      date: { $gte: today },
    });

    const campsWithRegistrationStatus = campDetails.map((camp) => {
      const isRegistered = camp.participants.includes(donorId.toString());
      const plainCampObject = camp.toObject();
      return { ...plainCampObject, registered: isRegistered };
    });

    res.render("donor/campRegistration", {
      pageTitle: "Camp Registration Details Page",
      path: "/donor/register-to-camp",
      camps: campsWithRegistrationStatus,
      bloodGroup: req.session.donorDetails.bloodGroup,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getDonorHistoryPage = async (req, res, next) => {
  try {
    const donorId = req.session.donorDetails._id;

    const donations = await Donation.find({ donorId: donorId });

    let donorDetails = [];

    if (donations != null && Array.isArray(donations) && donations.length) {
      let populatedDetails = await Donation.find({
        donorId: donorId,
      }).populate("campId");
      if (
        populatedDetails != null &&
        Array.isArray(populatedDetails) &&
        populatedDetails.length
      ) {
        donorDetails = populatedDetails.map((item) => {
          const plainObject = item.toObject();
          const plainCampDetailObject = plainObject.campId;
          let anObject = {};
          anObject["name"] = plainCampDetailObject.name;
          anObject["location"] = plainCampDetailObject.location;
          anObject["date"] = plainCampDetailObject.date;
          anObject["bloodAmount"] = plainObject.volume;
          return anObject;
        });
      }
    }
    if (donorDetails != null && Object.keys(donorDetails).length > 0) {
      res.render("donor/donorHistory", {
        pageTitle: "Donation History Details",
        path: "/donor/history",
        historyDetails: donorDetails,
        bloodGroup: req.session.donorDetails.bloodGroup,
      });
    } else {
      res.render("donor/donorHistory", {
        pageTitle: "Donation History Details",
        path: "/donor/history",
        historyDetails: [],
        bloodGroup: req.session.donorDetails.bloodGroup,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.registerDonorToCamp = async (req, res, next) => {
  try {
    const campId = req.body.campId;
    const donorId = req.session.donorDetails._id;
    const results = await Campaign.updateOne(
      { _id: campId },
      { $push: { participants: donorId } }
    );
    if (
      results != null &&
      results.matchedCount === 1 &&
      results.modifiedCount === 1
    ) {
      res.redirect("/donor/register-to-camp");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getLinkedHospitals = async (req, res, next) => {
  try {
    const linkedHospitals = await Hospital.find();
    if (linkedHospitals && linkedHospitals.length) {
      res.render("donor/linkedHospitals", {
        pageTitle: "Linked Hospitals",
        path: "/donor/linked-hospitals",
        linkedHospitals: linkedHospitals,
        bloodGroup: req.session.donorDetails.bloodGroup,
      });
    } else {
      res.render("donor/linkedHospitals", {
        pageTitle: "Linked Hospitals",
        path: "/donor/linked-hospitals",
        linkedHospitals: [],
        bloodGroup: req.session.donorDetails.bloodGroup,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getBloodRequestPage = async (req, res, next) => {
  try {
    const donorId = req.session.donorDetails._id;
    const requestDetails = await Request.find({ requestId: donorId });
    if (requestDetails != null && requestDetails.length > 0) {
      res.render("donor/myRequests", {
        pageTitle: "Blood Requests Details",
        path: "/donor/my-requests",
        view: req.query.view || "viewRequests",
        requestDetails: requestDetails,
      });
    } else {
      res.render("donor/myRequests", {
        pageTitle: "Blood Requests Details",
        path: "/donor/my-requests",
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
    const requestType = "user";
    const requestId = req.session.donorDetails._id;
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
      res.redirect("/donor/my-requests");
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
      res.redirect("/donor/my-requests");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.signupDoner = async (req, res, next) => {
  try {
    const donorName = req.body["donor-signup-name"];
    const donorAge = req.body["donor-signup-age"];
    const donorBloodType = req.body["donor-signup-bloodGroup"];
    const donorEmail = req.body["donor-signup-email"];
    const donorMobileNumber = req.body["donor-signup-mobileNo"];
    const donorAddress = req.body["donor-signup-address"];
    const donorPassword = req.body["donor-signup-password"];

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render("auth/donorLogin", {
        path: "/auth/donorSignup",
        pageTitle: "Donor Signup",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          name: donorName,
          age: donorAge,
          bloodGroup: donorBloodType,
          email: donorEmail,
          mobileNo: donorMobileNumber,
          address: donorAddress,
          password: donorPassword,
        },
        view: "signup",
      });
    }

    bcrypt
      .hash(donorPassword, 12)
      .then((hashedPassword) => {
        const donor = new Donor({
          name: donorName,
          age: donorAge,
          bloodGroup: donorBloodType,
          email: donorEmail,
          mobileNo: donorMobileNumber,
          address: donorAddress,
          password: hashedPassword,
        });
        return donor.save();
      })
      .then((result) => {
        console.log("Save Result", result);
        res.redirect("/auth/donor/signin");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

exports.signinDonor = async (req, res, next) => {
  try {
    const donorEmail = req.body["donor-signin-email"];
    const donorPassword = req.body["donor-signin-password"];

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/donorLogin", {
        path: "/auth/donorSignin",
        pageTitle: "Donor Signin",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: donorEmail,
          password: donorPassword,
        },
        view: "signin",
      });
    }

    await Donor.findOne({ email: donorEmail }).then((donor) => {
      if (!donor) {
        return res.status(422).render("auth/donorLogin", {
          path: "/auth/donorSignin",
          pageTitle: "Signin",
          errorMessage: "Invalid email or password",
          oldInput: {
            email: donorEmail,
            password: donorPassword,
          },
          view: "signin",
        });
      }

      bcrypt.compare(donorPassword, donor.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.donorDetails = donor;
          return req.session.save((error) => {
            if (error) {
              console.log("ERROR WHILE SAVING SESSION", error);
            }
            res.redirect("/donor/home");
          });
        }
        return res.status(422).render("auth/donorLogin", {
          path: "/auth/donorSignin",
          pageTitle: "Signin",
          errorMessage: "Invalid email or password",
          oldInput: {
            email: donorEmail,
            password: donorPassword,
          },
          view: "signin",
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
};
