process.env.NODE_ENV = "test";
const app = require("../app");
const rawData = require("../seed/testData");
const seedDB = require("../seed/seed");
const mongoose = require("mongoose");
