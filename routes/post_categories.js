/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {


//----------get all categories-----------
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM post_categories;`)
      .then((data) => {
        const category = data.rows;
        res.json({ category });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });


//---------get categories by category_id---------
  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM post_categories WHERE id = $1;`, [req.params.id])
      .then((result) => {
        if (result.rows.length) {
          return res.json(result.rows[0]);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });


//--------get category by post_id-------
  router.get("posts/:id", (req, res) => {
    db.query(`
    SELECT category as post_category
    FROM post_categories
    JOIN posts ON posts.category_id = post_categories.id
    WHERE post_categories.id = $1;`, [req.params.id])
      .then((result) => {
        return res.json(result);
        // if (result.rows.length) {

        // }
        // res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

//--------get category by name----------
  return router;
};
