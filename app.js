const app = require("express")();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const { DB_URL } = require("./config");

mongoose.connect(DB_URL).then(() => {
  console.log(`connected to ${DB_URL}`);
});

app.use(bodyParser.json());

app.use("/api", apiRouter);

module.exports = app;
