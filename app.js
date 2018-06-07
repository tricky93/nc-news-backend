const app = require("express")();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const { DB_URL } = require("./config");
const { badRouteChoice } = require("./controllers");

mongoose.connect(DB_URL).then(() => {
  console.log(`connected to ${DB_URL}`);
});

app.use(bodyParser.json());

app.use("/api", apiRouter);

app.get("/*", badRouteChoice);

app.use((err, req, res, next) => {
  if (res.status === 404) res.status(404).send({ message: "Page not found" });
  else if (err.status === 400) res.status(400).send({ message: err.message });
  else if (err.status === 500) res.status(500).send({ message: err.message });
  else console.log(err);
});

module.exports = app;
