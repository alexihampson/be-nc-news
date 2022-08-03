const app = require("./app");

const { PORT = 9320 } = process.env;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
