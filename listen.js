const PORT = process.env.PORT || require("./config").PORT;
const app = require("./app");

app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
