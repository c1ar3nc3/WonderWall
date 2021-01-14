const express = require("express");
const router = express.Router();
const { getCategoryByName } = require("../helpers/new_post_helper");
const { getUserById } = require("../helpers/userDatabaseQueries");
const {
  getPostDetailsById,
  likedPostByUser,
} = require("../helpers/postDatabaseQueries");

module.exports = (db) => {
  /////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //___________________________GET________________________________\\
  /////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //---------------- GET all posts to show all the posts------------
  router.get("/", (req, res) => {
    db.query(
      `
    SELECT posts.*, post_categories.category as category
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
        const user = req.session.user_id;
        if (result.rows.length) {
          const allPosts = result.rows;
          const templateVars = { posts: allPosts, user };
          res.render("search", templateVars);
        } else {
          const templateVars = { posts: [], user };
          res.render("search", templateVars);
        }
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //----------------- GET all posts for logged in user------------------

  router.get("/my_resources", (req, res) => {
    db.query(
      `SELECT * FROM posts WHERE owner_id = $1 UNION SELECT posts.* FROM posts JOIN user_feedbacks ON posts.id = user_feedbacks.post_id WHERE user_id = $1;`,
      [req.session.user_id]
    )
      .then((result) => {
        // console.log(result);
        const user = req.session.user_id;
        const MyPosts = result.rows;
        const templateVars = { posts: MyPosts, user };
        res.render("my_resources", templateVars);
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //----------------- GET post details by 'id'------------------------

  router.get("/post_details/:id", (req, res) => {
    const userId = req.session.user_id;
    const postId = req.params.id;
    const postByIdPromise = Promise.resolve(getPostDetailsById(postId));
    const likedByUserPromise = Promise.resolve(likedPostByUser(userId, postId));

    Promise.all([postByIdPromise, likedByUserPromise])
      .then((result) => {
        if (result.length) {
          const postDetails = result[0][0];
          const likedOrNot = result[1][0] || false;
          console.log("liked or not", likedOrNot);
          const templateVars = {
            likeObject: likedOrNot,
            post_details: postDetails,
            user: userId,
          };
          return res.render("post_details", templateVars);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //----------------- GET all posts by catagory_id ------------------------
  //
  router.get("/sort/:category_id", (req, res) => {
    db.query(
      `SELECT *, post_categories.category as category
    FROM posts
    JOIN post_categories ON post_categories.id = posts.category_id
    WHERE category_id = $1;`,
      [req.params.category_id]
    )
      .then((data) => {
        const user = req.session.user_id;
        const sortedPosts = data.rows;
        const templateVars = {posts: sortedPosts, user};
        return res.render("category", templateVars);
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  /////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //_____________________________POST___________________________________\\
  /////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //------------------- POST to create a new post------------------\\
  router.post("/new_post/create", (req, res) => {
    getCategoryByName(req.body.category_id)
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

  //------------------------Post like-------------------------
  router.get("/post_details/:id/like", (req, res) => {
    getPostDetailsById(req.params.id)
      .then((result) => {
        console.log(result);
        if (
          result[result.length - 1].user_id &&
          result[result.length - 1].post_id &&
          result[result.length - 1].user_id == req.session.user_id
        ) {
          console.log("UPDATE is working");
          const queryParams = [req.session.user_id, result[0].post_id];
          db.query(
            `UPDATE user_feedbacks SET likes = NOT likes WHERE user_id = $1 AND post_id = $2`,
            queryParams
          );
        } else {
          console.log("INSERT is working");
          const queryParams = [req.session.user_id, result[0].post_id, "t"];
          db.query(
            `INSERT INTO user_feedbacks (user_id, post_id, likes) VALUES ($1, $2, $3);`,
            queryParams
          );
        }
      })
      .then((result) => res.redirect("back"))
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  return router;
};
