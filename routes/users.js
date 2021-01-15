/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { getUserById } = require("../helpers/userDatabaseQueries");

module.exports = (db) => {
  //---------------------get all users-----------------
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then((data) => {
        const users = data.rows;
        res.json({ users });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //-----------------------get user profile by id---------------
  router.get("/profile/:id", (req, res) => {
    const userId = req.session.user_id;
    getUserById(userId)
      .then((result) => {
        if (result) {
          const templateVars = { user_detail: result[0] };
          res.render("user_profile", templateVars);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //-----------------------update user profile------------
  router.post("/update/:id", (req, res) => {
    queryParams = [
      req.body.first_name || "",
      req.body.last_name || "",
      req.body.city || "",
      req.body.gender || "",
      req.body.profile_picture ||
        "https://i.pinimg.com/236x/74/81/a7/7481a797bb6ef4083ede2e60f47a95cd.jpg",
      req.session.user_id,
    ];
    db.query(
      `UPDATE users SET first_name = $1, last_name = $2, city = $3, gender = $4, profile_picture = $5  WHERE id = $6 RETURNING *;`,
      queryParams
    )
      .then((result) => res.redirect("back"))
      .catch((err) => console.error(err.stack));
  });

  return router;
};
