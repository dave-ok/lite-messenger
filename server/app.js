const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const logger = require("morgan");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userAuthMW = require("./userAuthMW");

// create store for sessions to persist in database
const sessionStore = new SequelizeStore({ db });

const { json, urlencoded } = express;

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

// skip logging in test environment
app.use(logger("dev", { skip: (req, res) => process.env.NODE_ENV === "test" }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));
app.use(cookieParser());

app.use(userAuthMW);

// require api routes here after I create them
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));

// add ping test route
app.use("/ping", require("./routes/ping"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = { app, sessionStore };
