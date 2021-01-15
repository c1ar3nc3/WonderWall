const express = require("express");
const router = express.Router();
const { getCategoryByName } = require("../helpers/new_post_helper");
const { getUserById } = require("../helpers/userDatabaseQueries");
const {
  getAllCategories,
  getPostsByCategoryId,
} = require("../helpers/categoryQueries");
const {
  getPostDetailsById,
  likedPostByUser,
  postsOwnById,
  allLikedPostsByUser,
  postComments,
  avgRateAllPosts,
  searchPostsByTitle,
  postFeedById,
} = require("../helpers/postDatabaseQueries");

module.exports = (db) => {
  /////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //___________________________GET________________________________\\
  /////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

  //---------------- GET all posts to show all the posts------------
  router.get("/", (req, res) => {
    const userId = req.session.user_id;
    const getUserInfoPromise = Promise.resolve(getUserById(userId));
    const allCategoriesPromise = Promise.resolve(getAllCategories());
    const allPostsbyAvgRatePromise = Promise.resolve(avgRateAllPosts());
    Promise.all([
      getUserInfoPromise,
      allCategoriesPromise,
      allPostsbyAvgRatePromise,
    ])
      .then((data) => {
        const user = data[0][0];
        const allCategories = data[1];
        const allPosts = data[2];
        const templateVars = {
          user_detail: user,
          posts: allPosts,
          categories: allCategories,
        };
        res.render("index", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //----------------- GET new_post form------------------------
  router.get("/new_post", (req, res) => {
    const userId = req.session.user_id;
    getUserById(userId).then((result) => {
      const user = result[0];
      const templateVars = { user_detail: user };
      res.render("new_post", templateVars);
    });
  });

  //----------------- GET post by 'title'------------------------

  router.post("/search", (req, res) => {
    const userId = req.session.user_id;
    const getUserInfoPromise = Promise.resolve(getUserById(userId));
    const postsByTitlePromise = Promise.resolve(
      searchPostsByTitle(req.body.title)
    );
    Promise.all([getUserInfoPromise, postsByTitlePromise])
      .then((result) => {
        const user = result[0][0];
        if (result[1].length) {
          const allPosts = result[1];
          const templateVars = { posts: allPosts, user_detail: user };
          res.render("search", templateVars);
        } else {
          const templateVars = { posts: [], user_detail: user };
          res.render("search", templateVars);
        }
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //----------------- GET all posts for logged in user------------------

  router.get("/my_resources", (req, res) => {
    const userId = req.session.user_id;
    const getUserInfoPromise = Promise.resolve(getUserById(userId));
    const usersPost = Promise.resolve(postsOwnById(userId));
    const likedPosts = Promise.resolve(allLikedPostsByUser(userId));
    Promise.all([usersPost, likedPosts, getUserInfoPromise])
      .then((result) => {
        const myPosts = result[0];
        const likedPosts = result[1];
        const user = result[2][0];
        const templateVars = {
          likeObject: likedPosts,
          posts: myPosts,
          user_detail: user,
        };
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
    const allCommentsPromise = Promise.resolve(postComments(postId));
    const getUserInfoPromise = Promise.resolve(getUserById(userId));

    Promise.all([
      postByIdPromise,
      likedByUserPromise,
      allCommentsPromise,
      getUserInfoPromise,
    ])
      .then((result) => {
        if (result.length) {
          const postDetails = result[0][0];
          const likedOrNot = result[1][0] || false;
          const commentsArray = result[2];
          const user = result[3][0];
          const templateVars = {
            likeObject: likedOrNot,
            post_details: postDetails,
            user_detail: user,
            comments: commentsArray,
          };
          return res.render("post_details", templateVars);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //----------------- GET all posts by catagory_id ------------------------

  router.get("/sort/:category_id", (req, res) => {
    const userId = req.session.user_id;
    const categoryId = req.params.category_id;
    const catByIdPromise = Promise.resolve(getPostsByCategoryId(categoryId));
    const allCategoriesPromise = Promise.resolve(getAllCategories());
    const getUserInfoPromise = Promise.resolve(getUserById(userId));

    Promise.all([catByIdPromise, allCategoriesPromise, getUserInfoPromise])
      .then((result) => {
        if (result.length) {
          const sortedPosts = result[0];
          const categories = result[1];
          const loggedIn = result[2][0];
          const templateVars = {
            posts: sortedPosts,
            categories,
            user_detail: loggedIn,
            userId,
          };
          return res.render("category", templateVars);
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
    getCategoryByName(req.body.category_id)
      .then((result) => {
        return result;
      })
      .then((id) => {
        const queryParams = [
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
        ;`,
          queryParams
        );
      })
      // .then((result) => {
      //   return db.query(
      //     `INSERT INTO user_feedbacks (user_id, post_id) SELECT $1,id FROM posts ORDER BY id DESC LIMIT 1;`,
      //     [req.session.user_id]
      //   );
      // })
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => console.error(err.stack));
  });

  //------------------------Post like-------------------------
  router.get("/post_details/:id/like", (req, res) => {
    postFeedById(req.params.id, req.session.user_id)
      .then((result) => {
        if (result.length) {
          if (result[0].user_id == req.session.user_id) {
            const queryParams = [req.session.user_id, result[0].post_id];
            db.query(
              `UPDATE user_feedbacks SET likes = NOT likes WHERE user_id = $1 AND post_id = $2`,
              queryParams
            );
          }
        } else {
          const queryParams = [req.session.user_id, req.params.id, "t"];
          db.query(
            `INSERT INTO user_feedbacks (user_id, post_id, likes) VALUES ($1, $2, $3);`,
            queryParams
          );
        }
      })
      .then(() => res.redirect("back"))
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //------------------------------POST new Comment----------------------
  router.post("/post_details/:id/comment", (req, res) => {
    const userId = req.session.user_id;
    const postId = req.params.id;
    const comment = req.body.comment_text;
    const queryParams = [userId, postId, comment];
    db.query(
      `INSERT INTO user_feedbacks (user_id, post_id, comment) VALUES ($1, $2, $3);`,
      queryParams
    )
      .then(() => res.redirect("back"))
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  //--------------------------------POST new rate------------------------
  router.post("/post_details/:id/rate", (req, res) => {
    postFeedById(req.params.id, req.session.user_id)
      .then((result) => {
        if (result.length) {
          if (result[0].user_id == req.session.user_id) {
            const queryParams = [
              req.body.rating,
              req.session.user_id,
              result[0].post_id,
            ];
            db.query(
              `UPDATE user_feedbacks SET rating = $1 WHERE user_id = $2 AND post_id = $3`,
              queryParams
            );
          }
        } else {
          const queryParams = [
            req.session.user_id,
            req.params.id,
            req.body.rating,
          ];
          db.query(
            `INSERT INTO user_feedbacks (user_id, post_id, rating) VALUES ($1, $2, $3);`,
            queryParams
          );
        }
      })
      .then(() => res.redirect("back"))
      .catch((err) => res.status(400).json({ error: err.message }));
  });

  return router;
};

// SELECT posts.id, posts.title, user_feedbacks.* FROM posts JOIN user_feedbacks ON posts.id = user_feedbacks.post_id WHERE user_id = 1 AND post_id = 1;
