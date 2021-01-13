const { db } = require("../server.js");
/// Users
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getPostDetailsById = (id) => {
  const queryString = `SELECT DISTINCT posts.*, user_feedbacks.* FROM posts LEFT JOIN user_feedbacks ON posts.id = user_feedbacks.post_id WHERE posts.id = $1`;
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
