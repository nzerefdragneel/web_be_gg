const express = require("express");
const cors = require("cors");
var passport = require("passport");
const session = require("express-session");
require("dotenv").config();

const app = express();

var corsOptions = {
    origin: "https://web-fe-gg.vercel.app/",
};

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//config passport
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60 * 60 * 1000 },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// database
const db = require("./app/models");

// db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome!" });
});
app.all("/", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
// routes
require("./app/routes/auth.routers")(app);
require("./app/routes/user.routers")(app);
require("./app/routes/classes.routers")(app);
require("./app/routes/scoring.routers")(app);
require("./app/routes/grade.routers")(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
module.exports = app;
