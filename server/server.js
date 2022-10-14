const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
