const seedDB = require("./seed");
const mongoose = require("mongoose");
const DB_URL = `mongodb://localhost:27017/nc_news`;
const rawData = require("./devData");

mongoose
  .connect(DB_URL)
  .then(() => {
    return seedDB(rawData);
  })
  .then(() => {
    console.log(`successfully seeded...`);
  })
  .then(() => {
    return mongoose.disconnect();
  })
  .then(() => {
    console.log(`successfully disconnected`);
  });
