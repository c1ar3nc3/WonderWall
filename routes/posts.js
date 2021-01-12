const express = require("express");
const router = express.Router();
const { getCategoryByName } = require("../helpers/new_post_helper");

module.exports = (db) => {
  /////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //___________________________GET________________________________\\
  /////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //---------------- GET all posts to show all the posts------------
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM posts;`)
      .then((data) => {
        const allPosts = data.rows;
        const templateVars = { posts: allPosts };
        res.render("index", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //----------------- GET new_post by ------------------------
  router.get("/new_post", (req, res) => {
    res.render("new_post");
  });

  //----------------- GET post by 'title'------------------------

  router.get("/search/:title", (req, res) => {
    db.query(`SELECT * FROM posts WHERE title iLIKE $1;`, [
      `%${req.params.title}%`,
    ])
      .then((result) => {
        if (result.rows.length) {
          return res.json(result.rows);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //----------------- GET all post by 'owner_id'------------------

  router.get("/my_page/:owner_id", (req, res) => {
    db.query(`SELECT title, post_description FROM posts WHERE owner_id = $1;`, [
      req.params.owner_id,
    ])
      .then((result) => {
        if (result.rows.length) {
          return res.json(result.rows[0]);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //----------------- GET post by 'id'------------------------

  router.get("/:id", (req, res) => {
    db.query(`SELECT title FROM posts WHERE id = $1;`, [req.params.id])
      .then((result) => {
        if (result.rows.length) {
          return res.json(result.rows[0]);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  /////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //_____________________________POST___________________________________\\
  /////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //------------------- POST to create a new post------------------\\
  router.post("/new_post/create", (req, res) => {
    const categoryId = getCategoryByName(req.body.category_id).then(
      (result) => {
        const id = result;
        return id;
      }
    );
    queryParams = [
      req.body.title,
      req.body.post_description,
      req.body.url_address,
      req.body.image_url,
      categoryId,
      req.session.user_id,
    ];
    console.log("QUERY :", queryParams);
    db.query(
      `INSERT INTO posts (title, post_description, url_address, image_url, category_id, owner_id) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
      )
      RETURNING *;`,
      queryParams
    )
      .then((res) => console.log(res.rows))
      .catch((err) => console.error(err.stack));
  });

  return router;
};
