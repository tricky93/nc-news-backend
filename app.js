const DB_URL = process.env.DB_URL || require("./config").DB_URL;
const app = require("express")();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const cors = require("cors");
const { badRouteChoice } = require("./controllers");

mongoose.connect(DB_URL).then(() => {
  console.log(`connected to ${DB_URL}`);
});

app.use(cors());

app.use(bodyParser.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.use("/api", apiRouter);

app.get("/*", badRouteChoice);

app.use((err, req, res, next) => {
  if (err.status === 200) res.status(200).send({ message: err.message });
  else if (err.status === 404) res.status(404).send({ message: err.message });
  else if (err.status === 400) res.status(400).send({ message: err.message });
  else if (err.status === 500) res.status(500).send({ message: err.message });
  else res.status(500).send({ message: "Internal server error!" });
});

module.exports = app;
