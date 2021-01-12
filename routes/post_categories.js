
const express = require('express');
const router  = express.Router();

module.exports = (db) => {


//----------get all categories-----------
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM post_categories;`)
      .then((data) => {
        const categories = data.rows;
        const templateVars = { categories };
        res.render("index", templateVars);
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
  router.get("/posts/:id", (req, res) => {
    db.query(`
    SELECT category
    FROM post_categories
    JOIN posts ON posts.category_id = post_categories.id
    WHERE posts.id = $1;`, [req.params.id])
      .then((result) => {
        if (result.rows.length) {
          return res.json(result.rows);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

//--------get category by name----------
  router.get("/search/:category", (req, res) => {
    db.query(`
    SELECT category
    FROM post_categories
    WHERE category iLike $1;`, [`%${req.params.category}%`])
      .then((result) => {
        if (result.rows.length) {
          return res.json(result.rows);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

return router;
};
