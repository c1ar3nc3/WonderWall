const { db } = require("../server.js");
/// Posts Details By ID
/**
 * @return {Promise<{}>} A promise to the user.
 */
const getPostDetailsById = (id) => {
  const queryString = `SELECT DISTINCT posts.*, user_feedbacks.* FROM posts LEFT JOIN user_feedbacks ON posts.id = user_feedbacks.post_id WHERE posts.id = $1 ORDER BY user_feedbacks.id`;
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

/// Posts Owner
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
  const queryString = `SELECT posts.*, user_feedbacks.* FROM posts JOIN user_feedbacks ON posts.id = user_feedbacks.post_id WHERE user_id = $1 AND likes = TRUE`;
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

module.exports = {
  getPostDetailsById,
  likedPostByUser,
  postsOwnById,
  allLikedPostsByUser,
  postComments,
};
