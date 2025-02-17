exports.renderDonorSigninPage = (req, res, next) => {
  try {
    res.render("auth/donorLogin", {
      pageTitle: "Donor Login Page",
      path: "/auth/donor/signin",
      role: "donor",
      oldInput: {
        name: "",
        age: "",
        bloodGroup: "",
        email: "",
        mobileNo: "",
        address: "",
        password: "",
      },
      errorMessage: "",
      view: "signin",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.renderDonorSignupPage = (req, res, next) => {
  try {
    res.render("auth/donorLogin", {
      pageTitle: "Donor Signup Page",
      path: "/auth/donor/signup",
      role: "donor",
      oldInput: {
        name: "",
        age: "",
        bloodGroup: "",
        email: "",
        mobileNo: "",
        address: "",
        password: "",
      },
      errorMessage: "",
      view: "signup",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.renderAdminSigninPage = (req, res, next) => {
  try {
    res.render("auth/adminLogin", {
      pageTitle: "Admin Signin Page",
      path: "/auth/admin/signin",
      role: "admin",
      oldInput: {
        username: "",
        password: "",
      },
      errorMessage: "",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.renderHospitalSignupPage = (req, res, next) => {
  try {
    res.render("auth/hospitalLogin", {
      pageTitle: "Hospital Signup Page",
      path: "/auth/hospital/signup",
      role: "hospital",
      oldInput: {
        name: "",
        email: "",
        mobileNo: "",
        address: "",
        password: "",
      },
      errorMessage: "",
      view: "signup",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.renderHospitalSigninPage = (req, res, next) => {
  try {
    res.render("auth/hospitalLogin", {
      pageTitle: "Hospital Signin Page",
      path: "/auth/hospital/signin",
      role: "hospital",
      oldInput: {
        name: "",
        email: "",
        mobileNo: "",
        address: "",
        password: "",
      },
      errorMessage: "",
      view: "signin",
    });
  } catch (error) {
    console.log(error);
  }
};
