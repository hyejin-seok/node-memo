const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 3002;

const memoRoutes = require("./routes/memoRoutes");
const sercureKey = "adfqef1233afdgadf";
const users = {
  admin: "admin11",
  guest: "guest22",
};

app.use(cookieParser(sercureKey));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  if (req.cookies && req.cookies.userCookie) {
    res.render("index", { pageTitle: "Home", user: req.cookies.userCookie });
  } else {
    res.redirect("/login");
  }
});

app.use("/memos", memoRoutes);

app.get("/login", (req, res) => {
  const { error, logout } = req.query;
  if (req.cookies && req.cookies.userCookie) {
    res.redirect("/");
  } else {
    res.render("login", { pageTitle: "Login", error, logout });
  }
});

app.post("/login", (req, res) => {
  if (req.cookies && req.cookies.userCookie) {
    res.redirect("/");
  } else {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
      res.cookie("userCookie", username, {
        httpOnly: true,
        maxAge: 60000 * 60, // 1hr
      });
      res.redirect("/");
    } else {
      res.redirect("/login?error=1");
    }
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("userCookie");
  res.redirect("/login?logout=success");
});

app.get("/clear-cookies", (req, res) => {
  res.clearCookie("firstCookie");
  res.send("Cookie deleted!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}..:)`);
});
