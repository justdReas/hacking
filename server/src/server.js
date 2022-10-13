const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { verify } = require("jsonwebtoken");

const { fakeDB } = require("./fakeDB");

const app = express();
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

/* 
app.get("/", function (req, res) {
  // Cookies that have not been signed
  console.log("Cookies: ", req.cookies);

  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);
});
 */

// Register a user
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = fakeDB.find((user) => user.email === email);
    if (user) throw new Error(`${user.email} is already registered`);
    fakeDB.push({
      id: fakeDB.length,
      email,
      password,
    });
    res.send({ message: "User created" });
    console.log(fakeDB);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = fakeDB.find((user) => user.email === email);
    if (!user) throw new Error("User does not exist");

    const valid = await compare(password, user.password);
    if (!valid) throw new Error("Password not correct");
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});
