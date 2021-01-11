const express = require('express');
const router  = express.Router();



module.exports = (db) => {

/////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
____________________________GET___________________________________
/////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//---------------- GET all posts to show all the posts------------
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

//----------------- GET post by 'title'------------------------

  router.get("/search/:title", (req, res) => {
    db.query(`SELECT * FROM posts WHERE title iLIKE $1;`, [`%${req.params.title}%`])
      .then((result) => {
        if (result.rows.length) {
          return res.json(result.rows);
        }
        res.json({ message: "no resources found" });
      })
      .catch((err) => res.status(400).json({ error: err.message }));
  });

// //----------------- GET all post by 'owner_id'------------------

//   router.get("/:owner_id", (req, res) => {
//     db.query(`SELECT title FROM posts WHERE owner_id = $1;`, [req.params.owner_id])
//       .then((result) => {
//         if (result.rows.length) {
//           return res.json(result.rows[0]);
//         }
//         res.json({ message: "no resources found" });
//       })
//       .catch((err) => res.status(400).json({ error: err.message }));
//   });


/////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
_______________________________POST___________________________________
/////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//------------------- POST to create a new post------------------\\
  router.post("/", (req, res) => {
    queryParams = [
      req.body.title,
      req.body.post_description,
      req.body.url_address,
      req.body.image_url,
      req.body.category_id
    ];
    db.query(
      `INSERT INTO posts (title, post_description, url_address, image_url, category_id) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5
      )
      RETURNING *;`,
      queryParams
    )
      .then((res) => console.log(res.rows))
      .catch((err) => console.error(err.stack));
  });

  return router;
};
