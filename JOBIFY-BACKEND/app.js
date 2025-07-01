var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { start } = require('repl');
const { testConnection } = require('./database/connection');
const cors = require('cors');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/', indexRouter);

app.use(cors(
  {
    origin: 'http://localhost:5173/Signup'
  }

));

// catch 404 and forward to error handler
app.use('*', function (req, res, next) {
  res.status(404).json({
    success: false,
    message: "Route not found"
  })
});

//Global error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(500).json({
    success: false,
    message: err.message || "Internal server Error",
    error: process.env.NODE_ENV === 'development' ? err : "Something went wrong"
  })
});

const startServer = async () => {
  try {

    //test database connection here 
    testConnection();

    app.listen(process.env.PORT, function () {
      console.log('Example app is listening on port ' + process.env.PORT);
    });
  } catch (err) {
    console.log("Failed to start server : ", err);
    process.exit(1);
  }
}

startServer();

module.exports = app;
