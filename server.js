require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const PORT = process.env.PORT || 3001;

const passport = require("passport");
const OIDCStrategy = require("passport-openidconnect").Strategy;
const session = require("express-session");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://accounts.google.com",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuration de session
app.use(
  session({
    secret: "thomas-occupé-salim-4k-yanis-smallpp-ghanou-l3alamiya-rafik-bio",
    resave: true,
    saveUninitialized: false,
  })
);

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration de la stratégie OpenID Connect avec Google
passport.use(
  "openidconnect",
  new OIDCStrategy(
    {
      issuer: "https://accounts.google.com",
      authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenURL: "https://oauth2.googleapis.com/token",
      userInfoURL: "https://openidconnect.googleapis.com/v1/userinfo",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/callback",
      scope: "openid profile email",
    },
    (issuer, profile, cb) => {
      cb(null, profile);
    }
  )
);

// Sérialisation et désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Middleware pour vérifier si l'utilisateur est authentifié
function isAuthenticated(req, res, next) {
  console.log(req.isAuthenticated(), req.user);
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.get("/", (req, res) => {
  res.status(200).json({ connected: true });
});

app.get("/login", passport.authenticate("openidconnect"));
app.get("/auth/callback", (req, res, next) => {
  passport.authenticate("openidconnect", {
    failureRedirect: "http://localhost:5173",
    successRedirect: "http://localhost:5173/success",
    scope: ["profile", "email"],
  })(req, res, next);
});

app.get("/profile", isAuthenticated, (req, res) => res.status(200).json(req.user));

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

fs.readdirSync("./routes").map((route) => {
  if (route.split(".")[1] !== "routes") app.use("/api", require("./routes/" + route));
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
