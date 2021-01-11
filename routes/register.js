const express = require("express");
const router = express.Router();
const { getUserByEmail } = require("../helpers/userDatabaseQueries");

module.exports = (db) => {
  //---------------get rgisteration form----------------
  router.get("/", (req, res) => {
    req.session.user_id
      ? res.redirect("/")
      : res.render("register_page", { user: req.session.user_id });
  });

  //-----------------post registeration form------------
  router.post("/", (req, res) => {
    const userName = req.body.name;
    const email = req.body.email;
    const userPassword = req.body.password;
    queryParams = [userName, email, userPassword];
    if (userName && email && userPassword) {
      getUserByEmail(email)
        .then((result) => {
          if (!result.length) {
            db.query(
              `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
              queryParams
            );
            req.session.user_id = result.id;
            res.redirect("/");
          } else {
            const errorMessage = "This email address is already registered.";
            res.status(400).send(errorMessage);
          }
        })
        .catch((err) => console.error(err.stack));
    } else {
      const errorMessage =
        "Empty email or password. Please make sure you fill out both fields.";
      res.status(400).send(errorMessage);
    }
  });

  return router;
};
