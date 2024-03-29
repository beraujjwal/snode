'use strict';
require('dotenv').config();
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json, printf, colorize, align } = format;

let today = new Date();
let todayFromat = today.toISOString().split('T')[0];

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// define the custom settings for each transport (file, console)
let options = {
  file: {
    level: 'info',
    filename: `./logs/app-${todayFromat}.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: false,
  },
};

const logFormat = combine (
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  align(),
  printf(
      info => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`,
      error => `${info.timestamp} ${error.level.toUpperCase()}: ${info.message}`
  )
);


// instantiate a new Winston Logger with the settings defined above
let logger = createLogger({
  levels: levels,
  level: process.env.LOG_LEVEL || 'info',
  // format: combine(
  //   colorize({ all: true }),
  //   timestamp({
  //     format: 'YYYY-MM-DD hh:mm:ss.SSS A',
  //   }),
  //   align(),
  //   printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  // ),
  //format: combine(timestamp(), json()),
  format: logFormat,
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
