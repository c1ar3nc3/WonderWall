const { db } = require("../server.js");
/// Users
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserByEmail = (email) => {
  const queryString = `SELECT DISTINCT * FROM users WHERE email = $1`;
  return db
    .query(queryString, [email])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.error(err.stack));
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserById = (id) => {
  const queryString = `SELECT DISTINCT * FROM users WHERE id = $1`;
  return db
    .query(queryString, [id])
    .then((result) => {
      if (result.rows.length) {
        return result.rows;
      }
      return null;
    })
    .catch((err) => err.message);
};

module.exports = {
  getUserByEmail,
  getUserById,
};
