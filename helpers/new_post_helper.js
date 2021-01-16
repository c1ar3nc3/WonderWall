const { db } = require("../server.js");

/**
 * Get category ID by category name
 * @param {string} name The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getCategoryByName = (name) => {
  const queryString = `SELECT DISTINCT id FROM post_categories WHERE category = $1`;
  return db
    .query(queryString, [name])
    .then((result) => {
      if (result.rows.length) {
        return result.rows[0].id;
      }
      result.json({ message: "no resources found" });
    })
    .catch((err) => err.message);
};

module.exports = {
  getCategoryByName,
};
