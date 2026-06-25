require("colors");
const app = require("./src/app.js");

const port = process.env.PORT || 1234;

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;