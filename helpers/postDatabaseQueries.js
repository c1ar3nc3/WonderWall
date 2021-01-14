const { db } = require("../server.js");
/// Posts
/**
 * Get a single user from the database given their email.
 * @param {String} id The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getPostDetailsById = (id) => {
  const queryString = `SELECT DISTINCT posts.*, user_feedbacks.* FROM posts LEFT JOIN user_feedbacks ON posts.id = user_feedbacks.post_id WHERE post_id = $1 ORDER BY user_feedbacks.id`;
  return db
    .query(queryString, [id])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

module.exports = {
  getPostDetailsById,
};

/// Like Or Unlike
/**
 * Get a single user from the database given their email.
 * @param {String} user_id The email of the user.
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
 * Get a single user from the database given their email.
 * @param {String} id The email of the user.
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
 * Get a single user from the database given their email.
 * @param {String} id The email of the user.
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

module.exports = {
  getPostDetailsById,
  likedPostByUser,
  postsOwnById,
  allLikedPostsByUser,
};
