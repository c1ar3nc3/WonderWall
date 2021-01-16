const { db } = require("../server.js");

/// Posts Details By ID
/**
 * @return {Promise<{}>} A promise to the user.
 */
const getPostDetailsById = (id) => {
  const queryString = `SELECT DISTINCT posts.* FROM posts WHERE id = $1 `;
  return db
    .query(queryString, [id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

/// Like Or Unlike of a POST and a USER
/**
 * @return {Promise<{}>} A promise to the user.
 */
const likedPostByUser = (user_id, post_id) => {
  const queryString = `SELECT likes FROM user_feedbacks WHERE user_id = $1 AND post_id = $2`;
  return db
    .query(queryString, [user_id, post_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

/// Posts someone owns
/**
 * @return {Promise<{}>} A promise to the user.
 */
const postsOwnById = (user_id) => {
  const queryString = `SELECT * FROM posts WHERE owner_id = $1`;
  return db
    .query(queryString, [user_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

/// Liked Posts by ID
/**
 * @return {Promise<{}>} A promise to the user.
 */
const allLikedPostsByUser = (user_id) => {
  const queryString = `SELECT posts.*, user_feedbacks.* FROM posts JOIN user_feedbacks ON posts.id = user_feedbacks.post_id WHERE user_id = $1 AND likes = TRUE AND comment IS NULL`;
  return db
    .query(queryString, [user_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

/// All Comments for a post
/**
 * @return {Promise<{}>} A promise to the user.
 */
const postComments = (post_id) => {
  const queryString = `SELECT DISTINCT users.name, users.profile_picture, user_feedbacks.* FROM user_feedbacks JOIN users ON user_feedbacks.user_id = users.id WHERE post_id = $1 AND comment IS NOT NULL ORDER BY user_feedbacks.id DESC;`;
  return db
    .query(queryString, [post_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

/// Average rate for a post
/**
 * @return {Promise<{}>} A promise to the user.
 */
const avgRateByPost = (post_id) => {
  const queryString = `SELECT posts.title, ROUND(AVG(rating),2) as average_rating FROM posts JOIN user_feedbacks ON posts.id = user_feedbacks.post_id WHERE post_id = $1 AND rating != 0 GROUP BY posts.title;`;
  return db
    .query(queryString, [post_id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

/// Average rate for all posts
/**
 * @return {Promise<{}>} A promise to the user.
 */
const avgRateAllPosts = () => {
  const queryString = `SELECT posts.*, ROUND(AVG(rating),2) as average_rating FROM posts JOIN user_feedbacks ON posts.id = user_feedbacks.post_id GROUP BY posts.id ORDER BY posts.id DESC`;
  return db
    .query(queryString)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

/// Posts by searching title
/**
 * @return {Promise<{}>} A promise to the user.
 */
const searchPostsByTitle = (title) => {
  return db
    .query(`SELECT * FROM posts WHERE title iLIKE $1;`, [`%${title}%`])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

/// feedbacks by post and id
/**
 * @return {Promise<{}>} A promise to the user.
 */
const postFeedById = (post_id, user_id) => {
  return db
    .query(
      `SELECT DISTINCT posts.id, posts.title, user_feedbacks.* FROM posts LEFT JOIN user_feedbacks ON posts.id = user_feedbacks.post_id WHERE posts.id = $1 AND user_id =$2 ORDER BY user_feedbacks.id;`,
      [post_id, user_id]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

module.exports = {
  getPostDetailsById,
  likedPostByUser,
  postsOwnById,
  allLikedPostsByUser,
  postComments,
  avgRateByPost,
  avgRateAllPosts,
  searchPostsByTitle,
  postFeedById,
};
