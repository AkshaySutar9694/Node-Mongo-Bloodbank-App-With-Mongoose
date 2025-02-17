const mongoose = require("mongoose");

const Admin = require("../mongoose-models/admin");
const Campaign = require("../mongoose-models/campaign");
const Donor = require("../mongoose-models/donor");
const Hospital = require("../mongoose-models/hospital");
const Donation = require("../mongoose-models/donation");
const Request = require("../mongoose-models/request");
const BloodStock = require("../mongoose-models/bloodStock");

const { validationResult } = require("express-validator");

exports.getAdminHomePage = async (req, res, next) => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const [
      donationCamps,
      donors,
      linkedHospitals,
      bloodCollected,
      activeRequests,
      latestCampDetails,
    ] = await Promise.all([
      Campaign.find(),
      Donor.find(),
      Hospital.find(),
      Donation.find(),
      Request.find({ status: "pending" }),
      Campaign.geCampDetails({
        date: { $gte: today },
      }),
    ]);

    let totalBloodCollected = 0;
    if (bloodCollected?.length > 0) {
      totalBloodCollected = bloodCollected.reduce((bloodAmount, curentItem) => {
        return Number(bloodAmount) + Number(curentItem.volume);
      }, 0);
    }

    const liters = totalBloodCollected > 0 ? totalBloodCollected / 1000 : 0;
    const formatted_value = liters.toFixed(3);
    totalBloodCollected = formatted_value;

    const adminDetails = {
      donationCampCounts: donationCamps.length || 0,
      donorCounts: donors.length || 0,
      linkedHospitalsCount: linkedHospitals.length || 0,
      bloodCollected: totalBloodCollected || 0,
      activeRequests: activeRequests.length || 0,
      latestCampDetails:
        (latestCampDetails.length && latestCampDetails[0]) || null,
    };
    req.session.isLoggedIn = true;
    req.session.adminDetails = adminDetails;

    res.render("admin/home", {
      pageTitle: "Admin Home Page",
      path: "/admin/home",
      adminDetails: adminDetails,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getBloodBankInventoryDetails = async (req, res, next) => {
  try {
    const donationDetails = await Donation.find();
    const standardBloodGroups = [
      { bloodGroup: "A+", totalBlood: 0 },
      { bloodGroup: "A-", totalBlood: 0 },
      { bloodGroup: "B+", totalBlood: 0 },
      { bloodGroup: "B-", totalBlood: 0 },
      { bloodGroup: "O+", totalBlood: 0 },
      { bloodGroup: "O-", totalBlood: 0 },
      { bloodGroup: "AB+", totalBlood: 0 },
      { bloodGroup: "AB-", totalBlood: 0 },
    ];
    if (
      donationDetails != null &&
      Array.isArray(donationDetails) &&
      donationDetails.length > 0
    ) {
      donationDetails.forEach((ditem) => {
        let element = ditem.toObject();
        standardBloodGroups.forEach((item) => {
          if (item.bloodGroup === element.bloodGroup) {
            const totalBloodCollected =
              Number(item.totalBlood) + Number(element.volume);
            item.totalBlood = totalBloodCollected;
          }
        });
      });
      standardBloodGroups.forEach((item) => {
        const liters = item.totalBlood > 0 ? item.totalBlood / 1000 : 0;
        const formatted_value = liters.toFixed(3);
        item.totalBlood = formatted_value;
      });
    }
    console.log("standardBloodGroups", standardBloodGroups);
    res.render("admin/bloodBankInventory", {
      pageTitle: "Blood Bank Inventory",
      path: "/admin/blood-bank-folio",
      bloodData: standardBloodGroups,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getCampDetails = async (req, res, next) => {
  try {
    const campDetails = await Campaign.find();
    if (
      campDetails != null &&
      Array.isArray(campDetails) &&
      campDetails.length > 0
    ) {
      res.render("admin/campDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/camps",
        view: req.query.view || "viewCamps",
        camps: campDetails,
        oldInput: {
          campName: "",
          location: "",
          date: "",
        },
        errorMessage: "",
      });
    } else {
      res.render("admin/campDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/camps",
        view: req.query.view || "viewCamps",
        camps: [],
        oldInput: {
          campName: "",
          location: "",
          date: "",
        },
        errorMessage: "",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.registerCamp = async (req, res, next) => {
  try {
    const campName = req.body.campName;
    const campLocation = req.body.location;
    const campDate = req.body.date;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("admin/campDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/camps",
        view: "registerCamp",
        oldInput: {
          campName: campName,
          location: campLocation,
          date: campDate,
        },
        errorMessage: errors.array()[0].msg,
      });
    } else {
      const camp = new Campaign({
        name: campName,
        location: campLocation,
        date: campDate,
        participants: [],
      });
      const results = await camp.save();
      if (results) {
        res.redirect("/admin/camps");
      } else {
        res.render("admin/campDetails", {
          pageTitle: "Donation Camp Details",
          path: "/admin/camps",
          view: "registerCamp",
          oldInput: {
            campName: campName,
            location: campLocation,
            date: campDate,
          },
          errorMessage: "Somethng went wrong!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateCampDetails = async (req, res, next) => {
  try {
    const campId = req.params.id;
    const campName = req.body.name;
    const campLocation = req.body.location;
    const campDate = req.body.date;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("error", errors.array()[0].msg);
      return res.status(422).json({
        ok: false,
        message: errors.array()[0].msg || "Something went wrong!",
      });
    } else {
      const camp = await Campaign.findOne({ _id: campId });
      if (camp != null) {
        camp.name = campName;
        camp.location = campLocation;
        camp.date = campDate;
        camp.participants = camp.participants;
        const results = await camp.save();
        if (results) {
          res.status(200).send({ ok: true });
        } else {
          res.status(422).json({
            ok: false,
            message: "Something went wrong!",
          });
        }
      } else {
        res.status(422).json({
          ok: false,
          message: "Something went wrong!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCamp = async (req, res, next) => {
  try {
    const campId = req.params.id;
    const results = await Campaign.findOneAndDelete({ _id: campId });
    if (results) {
      res.status(200).send({ ok: true });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getDonorsRegisteredToCamp = async (req, res, next) => {
  try {
    const campId = req.params.id;
    const campDetailsFound = await Campaign.findById(campId);
    const campDonors = await Campaign.findById(campId).populate("participants");
    const campExpired = new Date(campDetailsFound.date) < new Date();
    const campDonorDonations = await Donation.find({ campId: campId });
    const campDonationsDonors = campDonors.participants.map((item) => {
      const plainitemObject = item.toObject();
      const doMatch = campDonorDonations.find(
        (donation) => item._id.toString() === donation.donorId.toString()
      );
      if (doMatch) {
        const itemCopy = { ...plainitemObject };
        itemCopy["donationId"] = doMatch._id.toString();
        itemCopy["bloodCollected"] = doMatch.volume;
        return { ...itemCopy };
      } else {
        return { ...plainitemObject };
      }
    });

    if (campDetailsFound != null && Object.keys(campDetailsFound).length > 0) {
      res.render("admin/campDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/camps",
        view: "campDonors",
        camp: campDetailsFound.name,
        donors: campDonationsDonors,
        campExpired: campExpired,
        oldInput: {
          campName: "",
          location: "",
          date: "",
        },
        errorMessage: "",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getRecordDonationPage = async (req, res, next) => {
  try {
    const campId = req.params.id;
    const campDetailsFound = await Campaign.findById(campId);
    const campDonors = await Campaign.findById(campId).populate("participants");
    const campDonorDonations = await Donation.find({ campId: campId });
    const campExpired = new Date(campDetailsFound.date) < new Date();

    const campDonationsDonors = campDonors.participants.map((item) => {
      const plainitemObject = item.toObject();
      const doMatch = campDonorDonations.find(
        (donation) => item._id.toString() === donation.donorId.toString()
      );
      if (doMatch) {
        const itemCopy = { ...plainitemObject };
        itemCopy["donationId"] = doMatch._id.toString();
        itemCopy["bloodCollected"] = doMatch.volume;
        return { ...itemCopy };
      } else {
        return { ...plainitemObject };
      }
    });
    console.log("campDonationsDonors", campDonationsDonors);
    if (campDetailsFound != null && Object.keys(campDetailsFound).length > 0) {
      res.render("admin/campDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/camps",
        view: "addDonations",
        camp: campDetailsFound.name,
        donors: campDonationsDonors,
        campExpired: campExpired,
        oldInput: {
          campName: "",
          location: "",
          date: "",
        },
        errorMessage: "",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.recordDonations = async (req, res, next) => {
  try {
    const { id: campId } = req.params;
    const { donorId, bloodGroup, bloodCollected, donationId } = req.body;

    if (!campId || !donorId || !bloodGroup || !bloodCollected) {
      return res.status(400).send({ ok: false, error: "Invalid input data" });
    }

    if (donationId && !mongoose.Types.ObjectId.isValid(donationId)) {
      return res.status(400).send({ ok: false, error: "Invalid donationId" });
    }

    const units = Math.floor(bloodCollected / 100);

    if (donationId) {
      const existingDonation = await Donation.findById(donationId);

      if (!existingDonation) {
        return res.status(404).send({ ok: false, error: "Donation not found" });
      }

      const oldUnits = Math.floor(existingDonation.volume / 100);
      const difference = units - oldUnits;

      const updatedDonation = await Donation.findOneAndUpdate(
        { _id: donationId },
        { $set: { volume: bloodCollected } },
        { new: true }
      );

      const resultOfBloodStockUpdate = await BloodStock.findOneAndUpdate(
        { bloodGroup },
        { $inc: { unitsAvailable: difference } },
        { upsert: true, new: true }
      );

      if (!updatedDonation || !resultOfBloodStockUpdate) {
        return res
          .status(500)
          .send({ ok: false, error: "Failed to update record" });
      }

      return res.status(200).send({ ok: true });
    } else {
      const dateEntry = new Date().toISOString().split("T")[0];
      const donation = new Donation({
        donorId,
        date: dateEntry,
        bloodGroup,
        volume: bloodCollected,
        campId,
      });

      const resultOfDonationQuery = await donation.save();
      const resultOfDonorUpdate = await Donor.findOneAndUpdate(
        { _id: donorId },
        {
          $set: { lastDonationDone: dateEntry },
          $inc: { donationCount: 1, points: 5 },
        }
      );
      const resultOfBloodStockUpdate = await BloodStock.findOneAndUpdate(
        { bloodGroup },
        { $inc: { unitsAvailable: units } },
        { upsert: true, new: true }
      );
      if (
        !resultOfDonationQuery ||
        !resultOfDonorUpdate ||
        !resultOfBloodStockUpdate
      ) {
        return res
          .status(500)
          .send({ ok: false, error: "Database operation failed" });
      }

      return res.status(200).send({ ok: true });
    }
  } catch (error) {
    console.error("Error in recordDonations:", error);
    res.status(500).send({ ok: false, error: error.message });
  }
};

exports.getAllDonorDetails = async (req, res, next) => {
  try {
    const donorDetails = await Donor.find();
    if (
      donorDetails != null &&
      Array.isArray(donorDetails) &&
      donorDetails.length > 0
    ) {
      res.render("admin/donorDetails", {
        pageTitle: "Donor Details",
        path: "/admin/donorDetails",
        donorDetails: donorDetails,
        historyDetails: null,
        requestDetails: null,
        donorName: null,
        view: "donorList",
      });
    } else {
      res.render("admin/donorDetails", {
        pageTitle: "Donor Details",
        path: "/admin/donorDetails",
        donorDetails: [],
        historyDetails: null,
        requestDetails: null,
        donorName: null,
        view: "donorList",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getDonorsDonationDetails = async (req, res, next) => {
  try {
    const donorId = req.body["data-donor-id"];
    const donorName = req.body["data-donor-name"];
    const donations = await Donation.find({ donorId: donorId });

    let donorDetails = [];

    if (donations != null && Array.isArray(donations) && donations.length) {
      let populatedDetails = await Donation.find({ donorId: donorId }).populate(
        "campId"
      );
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
    res.render("admin/donorDetails", {
      pageTitle: "Donor's Dontion Details",
      path: "/admin/donorDetails",
      donorDetails: null,
      historyDetails: donorDetails,
      requestDetails: null,
      donorName: donorName,
      view: "donationList",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getDonorsRequestDetails = async (req, res, next) => {
  try {
    const donorId = req.body["data-donor-id"];
    const donorName = req.body["data-donor-name"];
    const requetDetails = await Request.find({ requestId: donorId });
    if (
      requetDetails != null &&
      Array.isArray(requetDetails) &&
      requetDetails.length > 0
    ) {
      res.render("admin/donorDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/donorDetails",
        donorDetails: null,
        historyDetails: null,
        requestDetails: requetDetails,
        donorName: donorName,
        view: "requestList",
      });
    } else {
      res.render("admin/donorDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/donorDetails",
        donorDetails: null,
        historyDetails: null,
        requestDetails: requetDetails,
        donorName: donorName,
        view: "requestList",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getDonorDetailsById = async (req, res, next) => {
  try {
    const donorId = req.params.id;
    const requesterDetails = await Donor.findById(donorId);
    res.status(200).send({ ok: true, donorInfo: requesterDetails });
  } catch (error) {
    console.log(error);
  }
};

exports.getRequestProcessingPage = async (req, res, next) => {
  try {
    const bloodStock = await BloodStock.find();
    const requests = await Request.find();
    res.render("admin/requests", {
      pageTitle: "Request Details",
      path: "/admin/requests",
      view: "viewRequests",
      bloodStock: bloodStock || [],
      requests: requests || [],
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getHospitalDetailsById = async (req, res, next) => {
  try {
    const hospiotalId = req.params.id;
    const requesterDetails = await Hospital.findById(hospiotalId);
    res.status(200).send({ ok: true, hospitalInfo: requesterDetails });
  } catch (error) {
    console.log(error);
  }
};

exports.processRequest = async (req, res, next) => {
  try {
    const requestId = req.body.requestId;
    const action = req.body.action;
    const requestedUnits = req.body.units;
    const bloodGroup = req.body.bloodGroup;
    if (requestedUnits != null && bloodGroup != null) {
      const stockData = await BloodStock.findOne({
        bloodGroup: bloodGroup,
      });
      const availableUnits = stockData != null ? stockData.unitsAvailable : 0;

      if (availableUnits != null && availableUnits >= requestedUnits) {
        const newUnits = availableUnits - requestedUnits;
        const requesterDetails = await Request.findByIdAndUpdate(
          { _id: requestId },
          { $set: { status: action } }
        );
        const updateBloodStock = await BloodStock.findOneAndUpdate(
          { bloodGroup: bloodGroup },
          { $set: { unitsAvailable: newUnits } }
        );
        if (updateBloodStock && requesterDetails) {
          res
            .status(200)
            .json({ ok: true, message: "Request processed successfully!" });
        } else {
          res.status(500).json({ ok: false, message: "Something went wrong!" });
        }
      } else {
        res.status(200).json({
          ok: true,
          message: "Request cannot be processed, blood units not available",
        });
      }
    } else if (action === "rejected") {
      const requesterDetails = await Request.findByIdAndUpdate(
        { _id: requestId },
        { $set: { status: action } }
      );
      if (requesterDetails) {
        res
          .status(200)
          .json({ ok: true, message: "Request processed successfully!" });
      } else {
        res.status(200).json({
          ok: true,
          message: "Request cannot be processed, blood units not available",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getAllHospitalDetails = async (req, res, next) => {
  try {
    const hospitalDetails = await Hospital.find();
    if (
      hospitalDetails != null &&
      Array.isArray(hospitalDetails) &&
      hospitalDetails.length > 0
    ) {
      res.render("admin/hospitalDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/hospitalDetails",
        hospitalDetails: hospitalDetails,
        requestDetails: null,
        hospitalName: null,
        view: "hospitalList",
      });
    } else {
      res.render("admin/hospitalDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/hospitalDetails",
        hospitalDetails: [],
        requestDetails: null,
        hospitalName: null,
        view: "hospitalList",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getHospitalsRequestDetails = async (req, res, next) => {
  try {
    const hospitalId = req.body["data-hospital-id"];
    const hospitalName = req.body["data-hospital-name"];
    const requetDetails = await Request.find({ requestId: hospitalId });
    if (
      requetDetails != null &&
      Array.isArray(requetDetails) &&
      requetDetails.length > 0
    ) {
      res.render("admin/hospitalDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/hospitalDetails",
        hospitalDetails: null,
        requestDetails: requetDetails,
        hospitalName: hospitalName,
        view: "requestList",
      });
    } else {
      res.render("admin/hospitalDetails", {
        pageTitle: "Donation Camp Details",
        path: "/admin/hospitalDetails",
        hospitalDetails: null,
        requestDetails: requetDetails,
        hospitalName: hospitalName,
        view: "requestList",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.signinAdmin = async (req, res, next) => {
  try {
    const adminUsername = req.body["admin-signin-username"];
    const adminPassword = req.body["admin-signin-password"];

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/adminLogin", {
        path: "/auth/adminLogin",
        pageTitle: "Admin Signin",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          username: adminUsername,
          password: adminPassword,
        },
      });
    }

    Admin.findOne({
      username: adminUsername,
    }).then((admin) => {
      if (!admin) {
        return res.status(422).render("auth/adminLogin", {
          path: "/auth/adminLogin",
          pageTitle: "Admin Signin",
          errorMessage: "Invalid username or password.",
          oldInput: {
            username: adminUsername,
            password: adminPassword,
          },
        });
      }
      if (admin.password === adminPassword) {
        return res.redirect("/admin/home");
      } else {
        return res.status(422).render("auth/adminLogin", {
          path: "/auth/adminLogin",
          pageTitle: "Admin Signin",
          errorMessage: "Invalid username or password.",
          oldInput: {
            username: adminUsername,
            password: adminPassword,
          },
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
