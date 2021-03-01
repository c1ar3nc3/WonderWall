## WonderWall Project

WonderWall is a multi-page app that allows learners to save learning resources in a central place that is publicly available to any user. Posts include a title, description, image and link. Users have the ability to like, comment, and rate other posts. The likes and comments are linked to the currently logged in user. Likes are responsive. There is also a search feature based on posts the user has liked or by keyword.

Created in collaboration with [Denys Pyshniuk](https://github.com/DenysPyshniuk) and [Sepehr Sobhani](https://github.com/Sepehr-Sobhani).

## App Highlights:

- users can save an external URL along with a title and description
- users can search for already-saved resources created by any user
- users can categorize any resource under a topic and create new categories
- users can comment on any resource
- users can rate any resource
- users can change their ratings
- users can like any resource
- users can unlike any resource
- users can view all their own and all liked resources on one page ("My resources")
- users can register, log in, log out and update their profile

## Screenshots

- Home Page
  !["Home page"](https://github.com/DenysPyshniuk/resourceWall/blob/master/public/images/gitHub_screenshots/Screenshot-20210115175647-1918x974.png?raw=true)
- My Resources and Liked Page
  !["My posts"](https://github.com/DenysPyshniuk/resourceWall/blob/master/public/images/gitHub_screenshots/Screenshot-20210115175702-1918x974.png?raw=true)
- Profile Page
  !["Profile page"](https://github.com/DenysPyshniuk/resourceWall/blob/master/public/images/gitHub_screenshots/Screenshot-20210115175726-1641x653.png?raw=true)

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information

- username: `labber`
- password: `labber`
- database: `midterm`

3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`

- Check the db folder to see what gets created and seeded in the SDB

7. Run the server: `npm run local`

- Note: nodemon is used, so you should not have to restart your server

8. Visit `http://localhost:8080/`

## Warnings & Tips

- Do not edit the `layout.css` file directly, it is auto-generated by `layout.scss`
- Split routes into their own resource-based file names, as demonstrated with `users.js` and `widgets.js`
- Split database schema (table definitions) and seeds (inserts) into separate files, one per table. See `db` folder for pre-populated examples.
- Use the `npm run db:reset` command each time there is a change to the database schema or seeds.
  - It runs through each of the files, in order, and executes them against the database.
  - Note: you will lose all newly created (test) data each time this is run, since the schema files will tend to `DROP` the tables and recreate them.

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- Express
- EJS
- Bcrypt
- body-parser
- Cookie-Session
- Method-Override
- Sass
