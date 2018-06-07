const badRouteChoice = (req, res, next) => {
  res.status(404).send({ message: "page not found" });
};

module.exports = { badRouteChoice };
