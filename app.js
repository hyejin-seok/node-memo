const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const PORT = 3002;

const memoRoutes = require("./routes/memoRoutes");

const users = [];
const sercureKey = "adfqef1233afdgadf";

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(sercureKey));
app.use(express.static("public"));

const checkAuthenticated = (req, res, next) => {
  if (req.cookies.userCookie) {
    return next(); // User is authenticated
  }
  res.redirect("/login");
};

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index", { pageTitle: "Home", user: req.cookies.userCookie });
});

app.get("/signup", (req, res) => {
  res.render("signup", { pageTitle: "Sign up" });
});

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      username: req.body.username.toLowerCase(),
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch (error) {
    res.redirect("/signup");
  }
});

app.get("/login", (req, res) => {
  const { error, logout } = req.query;
  if (req.cookies && req.cookies.userCookie) {
    res.redirect("/");
  } else {
    res.render("login", { pageTitle: "Login", error, logout });
  }
});

app.post("/login", async (req, res) => {
  console.log("Login Request Received");
  if (req.cookies && req.cookies.userCookie) {
    console.log("User is already authenticated");
    res.redirect("/");
  } else {
    const { username, password } = req.body;
    console.log("Entered username:", username);
    console.log("Entered password:", password);

    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    console.log("Found user:", user);

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log("Password match result:", passwordMatch);

      if (passwordMatch) {
        console.log("Authentication successful");
        res.cookie("userCookie", username, {
          httpOnly: true,
          maxAge: 60000 * 60, // 1hr
        });
        res.redirect("/");
      } else {
        console.log("Password does not match");
        res.redirect("/login?error=1");
      }
    } else {
      console.log("User not found");
      res.redirect("/login?error=1");
    }
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("userCookie");
  res.redirect("/login?logout=success");
});

app.use("/memos", checkAuthenticated, memoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}..`);
});
