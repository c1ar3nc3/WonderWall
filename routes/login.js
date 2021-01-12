const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //--------------------------get login form---------------
  router.get("/", (req, res) => {
    req.session.user_id
      ? res.redirect("/")
      : res.render("login_page", { user: req.session.user_id });
  });

  //--------------------------post login form--------------
  router.post("/", (req, res) => {
    req.session.user_id = 1;
    res.redirect("/");
  });

  //------------------------logout-------------------------
  router.get("/logout", (req, res) => {
    console.log("req.session:", req.session);
    req.session = null;
    res.redirect("/");
  });

  return router;
};
