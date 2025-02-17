const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const errorController = require("./controllers/errorController");
const csrf = require("csurf");
const helmet = require("helmet");
const morgan = require("morgan");

//const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.00y0i.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;

const MONGODB_URI =
  "mongodb+srv://super-user-01:Zz94nz0cxNOmGDDc@cluster0.00y0i.mongodb.net/bloodbank?retryWrites=true&w=majority&appName=Cluster0";

//const MONGODB_URI = "mongodb://localhost:27017/bloodbank_mongoose";

const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();
app.set("view engine", "ejs");
app.set("views", "views");

const loginRoutes = require("./routes/login");
const donorRoutes = require("./routes/donor");
const hospitalRoutes = require("./routes/hospital");
const adminRoutes = require("./routes/admin");

const accessLogs = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(helmet());
//app.use(morgan("combined", { stream: accessLogs }));

app.use(
  session({
    secret: "node-bloodbank-app-097421",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(csrfProtection);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/", (req, res, next) => {
  console.log("Interceptor", req.path);
  next();
});

app.get("/", (req, res, next) => {
  res.redirect("/auth/donor/signin");
});

app.use("/auth", loginRoutes);
app.use("/donor", donorRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/admin", adminRoutes);

app.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
});

app.use(errorController.getErrorPage);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 3002);
    console.log("Server strted on port 3002!");
  })
  .catch((err) => {
    console.log(err);
  });
