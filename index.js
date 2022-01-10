const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const express = require("express");
const session = require("express-session");
const hbs = require("hbs");
const validator = require("validator");
const myRESTCollection = require("./connection");
const port = process.env.PORT || 9000;
const apiRouter = new express.Router();
const app = express();
hbs.registerPartials("./partials");

app.use(
  session({
    secret: "some secret",
    cookie: { maxAge: 1800000 },
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "hbs");
app.use(express.json());
app.use(apiRouter);

apiRouter.get("/", (req, res) => {
  res.render("first");
});

apiRouter.get("/register", (req, res) => {
  res.render("register", {
    name: "Mohammad",
  });
});

apiRouter.get("/login", (req, res) => {
  res.render("login");
});

apiRouter.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const res7 = await myRESTCollection.findOne({ email: email });
    const res9 = await myRESTCollection
      .findOne({ email: email })
      .countDocuments();
    if (res9 < 1) {
      res.send("No user with this email id");
    } else {
      const res8 = await bcrypt.compare(password, res7.password);
      if (res8) {
        req.session.authenticated = true;
        req.session.email = email;
        return res.redirect("dashboard");
      } else {
        res.send("Wrong password");
      }
    }
  } catch (err) {
    res.send("Error: " + err);
  }
});

apiRouter.get("/logout", (req, res) => {
  req.session.authenticated = false;
  return res.redirect("login");
});

apiRouter.get("/dashboard", (req, res) => {
  if (req.session.authenticated && req.session.email) {
    res.send(`Hello ${req.session.email}`);
  } else {
    return res.redirect("login");
  }
});

apiRouter.post("/register", async (req, res) => {
  const email = req.body.email;
  try {
    const password = await bcrypt.hash(req.body.password, 4);
    const obj = {
      email: email,
      password: password,
    };
    try {
      const res5 = await myRESTCollection.insertMany([obj]);
      res.send("Success");
    } catch (err) {
      res.send(err);
    }
  } catch (err) {
    res.send("Error in generating hash of password");
  }
});

apiRouter.post("/api", async (req, res) => {
  try {
    const res3 = await myRESTCollection.insertMany([req.body]);
    console.log(res3);
  } catch (err) {
    console.log(err);
  }
});

apiRouter.get("/api", async (req, res) => {
  try {
    const result = await myRESTCollection.find({});
    res.send(result);
  } catch (err) {
    res.send("Error");
  }
});

apiRouter.get("/api/:name", async (req, res) => {
  try {
    const result = await myRESTCollection.find({ name: req.params.name });
    const count = await myRESTCollection
      .find({ name: req.params.name })
      .countDocuments();
    if (count < 1) {
      res.send("No result found");
    } else {
      res.send(result);
    }
  } catch (err) {
    res.send("Error");
  }
});

app.listen(port, () => {
  console.log(`Server started`);
});
