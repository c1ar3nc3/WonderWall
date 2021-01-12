const express = require("express");
const router = express.Router();
const { getCategoryByName } = require("../helpers/new_post_helper");
const { getUserById } = require("../helpers/userDatabaseQueries");

module.exports = (db) => {
  /////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //___________________________GET________________________________\\
  /////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //---------------- GET all posts to show all the posts------------
  router.get("/", (req, res) => {
    db.query(`
    SELECT *, post_categories.category as category
    FROM posts
    JOIN post_categories ON post_categories.id = category_id;`)
      .then((data) => {
        const user = req.session.user_id;
        const allPosts = data.rows;
        const templateVars = { posts: allPosts, user };
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

  router.post("/search", (req, res) => {
    db.query(`SELECT * FROM posts WHERE title iLIKE $1;`, [
      `%${req.body.title}%`,
    ])
      .then((result) => {
        if (result.rows.length) {
          const allPosts = result.rows;
          const templateVars = { posts: allPosts };
          res.render("search", templateVars);
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

  //----------------- GET all posts by catagory ------------------------

  router.get("/sort/:category", (req, res) => {
    db.query(`SELECT *, post_categories.category as category
    FROM posts
    JOIN post_categories ON post_categories.id = posts.category_id
    WHERE category iLIKE $1;`, [`%${req.params.category}%`])
      .then((data) => {
        const sortedPosts = data.rows;
        const templateVars = {posts: sortedPosts};
        console.log(templateVars)
        res.render("index", templateVars);
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });


  /////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //_____________________________POST___________________________________\\
  /////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //------------------- POST to create a new post------------------\\
  router.post("/new_post/create", (req, res) => {
    const categoryId = getCategoryByName(req.body.category_id)
      .then((result) => {
        return result;
      })
      .then((id) => {
        queryParams = [
          req.body.title,
          req.body.post_description,
          req.body.url_address,
          req.body.image_url,
          id,
          req.session.user_id,
        ];
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
        );
      })
      .then((result) => res.redirect("/"))
      .catch((err) => console.error(err.stack));
  });

  return router;
};
