const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
require("./services/google-strategy");
require("./services/jwt-utils");
require("dotenv").config();
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("db connected")
);

app.use("/auth", authRoutes);
app.use(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  profileRoutes
);

app.get("/", (req, res) => {
  res.send("dash");
});

app.listen(process.env.PORT, () => {
  console.log("listening on port ", process.env.PORT);
});
