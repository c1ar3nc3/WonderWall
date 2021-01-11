/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

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

  //-----------------------get user by id---------------
  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM users WHERE id = $1;`, [req.params.id])
      .then((result) => {
        if (result.rows.length) {
          return res.json(result.rows[0]);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });
  //-----------------------update user profile------------
  router.post("/:id", (req, res) => {
    queryParams = [
      req.body.first_name || "",
      req.body.last_name || "",
      req.body.city || "",
      req.body.gender || "",
      req.body.profile_picture || "",
      req.params.id,
    ];
    db.query(
      `UPDATE users SET first_name = $1, last_name = $2, city = $3, gender = $4, profile_picture = $5  WHERE id = $6 RETURNING *;`,
      queryParams
    )
      .then((res) => console.log(res.rows))
      .catch((err) => console.error(err.stack));
  });

  return router;
};
