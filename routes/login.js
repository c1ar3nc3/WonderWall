const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //--------------------------get login form---------------
  router.get("/", (req, res) => {
    // req.session.user_id
    //   ? res.redirect("/")
    //   : res.render("login_page", { user: req.session.user_id });
    res.render("login_page");
  });

  //--------------------------post login form--------------
  router.get("/:id", (req, res) => {
    req.session.user_id = req.params.id;
    res.redirect("/");
  });

  return router;
};
