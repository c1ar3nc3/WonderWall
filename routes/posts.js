const express = require('express');
const router  = express.Router();



module.exports = (db) => {

  // GET all posts to show all the posts
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

  // GET post by 'id'
  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM posts WHERE id = $1;`, [req.params.id])
      .then((result) => {
        if (result.rows.length) {
          return res.json(result.rows[0]);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });


  // POST post to create a new post
  router.post("/", (req, res) => {
    queryParams = [
      req.body.title,
      req.body.post_description,
      req.body.url_address,
      req.body.image_url,
      req.body.category_id
    ];
    db.query(
      `INSERT INTO VALUES
      title = $1,
      post_description = $2,
      url_address = $3,
      image_url = $4,
      category_id = $5
      RETURNING *;`,
      [queryParams]
    )
      .then((res) => console.log(res.rows))
      .catch((err) => console.error(err.stack));
  });

  return router;
};
