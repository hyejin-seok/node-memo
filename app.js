const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const path = require("path");
const methodOverride = require("method-override");
const PORT = 3002;

const memoRoutes = require("./routes/memoRoutes");

const users = [];
const sercureKey = "adfqef1233afdgadf";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(sercureKey));
app.use(express.static("public"));

// Middleware to check if the user is authenticated
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
  res.render("auth/signup", { pageTitle: "Sign up" });
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
    console.error(error);
    res.redirect("/signup");
  }
});

app.get("/login", (req, res) => {
  const { error, logout } = req.query;
  if (req.cookies && req.cookies.userCookie) {
    res.redirect("/");
  } else {
    res.render("auth/login.ejs", { pageTitle: "Login", error, logout });
  }
});

app.post("/login", async (req, res) => {
  if (req.cookies && req.cookies.userCookie) {
    res.redirect("/");
  } else {
    const { username, password } = req.body;
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        res.cookie("userCookie", username, {
          httpOnly: true,
          maxAge: 60000 * 60 * 6, // 6hr
        });
        res.redirect("/");
      } else {
        res.redirect("/login?error=1");
      }
    } else {
      res.redirect("/login?error=1");
    }
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("userCookie");
  res.redirect("/login?logout=success");
});

app.use("/memos", checkAuthenticated, memoRoutes);

app.get("/contact", checkAuthenticated, (req, res) => {
  res.render("contact", { pageTitle: "Contact" });
});

app.post("/submit", (req, res) => {
  const { fullname, email, message } = req.body;
  console.log(`Name: ${fullname}, Email: ${email}, Message: ${message}`);
  res.redirect("/success?status=success");
});

app.get("/success", (req, res) => {
  const isSuccess = req.query.status === "success";
  res.render("formResult", { isSuccess });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}..`);
});
