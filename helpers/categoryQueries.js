const { db } = require("../server.js");

//Categories




const getCategoryByPost = (post_id) => {
  const queryString = `
  SELECT category
  FROM post_categories
  JOIN posts ON posts.category_id = post_categories.id
  WHERE posts.id = $1;`;
  return db
    .query(queryString, [post_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

const getCategoryByName = (category) => {
  const queryString = `
  SELECT category
  FROM post_categories
  WHERE category iLike $1;`
  return db
    .query(queryString, [`%${category}%`])
    .then((result) => {
      if (result.rows.length) {
        return result.rows;
      }
      result.json({ message: "no resources found" });
    })
    .catch((err) => console.error(err.stack));
};


module.exports = {
  getCategoryByPost,
  getCategoryByName
}
