const express = require("express");
const router = express.Router();
const { getCategoryByName } = require("../helpers/new_post_helper");
const { getUserById } = require("../helpers/userDatabaseQueries");
const { getPostDetailsById } = require("../helpers/postDatabaseQueries");

module.exports = (db) => {
  /////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //___________________________GET________________________________\\
  /////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //---------------- GET all posts to show all the posts------------
  router.get("/", (req, res) => {
    db.query(
      `
    SELECT *, post_categories.category as category
    FROM posts
    JOIN post_categories ON post_categories.id = category_id;`
    )
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

  //----------------- GET new_post------------------------
  router.get("/new_post", (req, res) => {
    const user = req.session.user_id;
    const templateVars = { user };
    res.render("new_post", templateVars);
  });

  //----------------- GET post by 'title'------------------------

  router.post("/search", (req, res) => {
    db.query(`SELECT * FROM posts WHERE title iLIKE $1;`, [
      `%${req.body.title}%`,
    ])
      .then((result) => {
        console.log();
        if (result.rows.length) {
          const user = req.session.user_id;
          const allPosts = result.rows;
          const templateVars = { posts: allPosts, user };
          res.render("search", templateVars);
        } else{
          const templateVars = { posts: [] };
          res.render("search", templateVars);
        }
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //----------------- GET all posts for logged in user------------------

  router.get("/my_resources", (req, res) => {
    db.query(`SELECT * FROM posts WHERE owner_id = $1 UNION SELECT posts.* FROM posts JOIN user_feedbacks ON posts.id = user_feedbacks.post_id WHERE user_id = $1;`, [req.session.user_id])
      .then((result) => {
        console.log(result);
        const user = req.session.user_id;
        const MyPosts = result.rows;
        const templateVars = { posts: MyPosts, user };
        res.render("my_resources", templateVars);
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //----------------- GET post details by 'id'------------------------

  router.get("/post_details/:id", (req, res) => {
    getPostDetailsById(req.params.id)
      .then((result) => {
        if (result.length) {
          const user = req.session.user_id;
          const post_details = result[0];
          const templateVars = { post_details, user };
          return res.render("post_details", templateVars);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //----------------- GET all posts by catagory_id ------------------------
  //
  router.get("/sort/:category_id", (req, res) => {
    db.query(`SELECT *, post_categories.category as category
    FROM posts
    JOIN post_categories ON post_categories.id = posts.category_id
    WHERE category_id = $1;`, [req.params.category_id])
      .then((data) => {
        const sortedPosts = data.rows;
        const templateVars = {posts: sortedPosts};
        return res.json(templateVars);
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
