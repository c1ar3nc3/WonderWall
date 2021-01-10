const express = require('express');
const router  = express.Router();



// Posts GET route to show all the posts
module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM posts;`)
      .then(data => {
        const posts = data.rows;
        res.json({ posts });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

// Posts PUT
