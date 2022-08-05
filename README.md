# Northcoders News API

## https://alexi-nc-news.herokuapp.com/api

## Information

This is an HTTP api designed to serve, modify, upload, and delete articles, comments, and relevent metadata from a PostgreSQL database. It was built using and designed for `Node.js v18.3.0` and `PostgreSQL v 12.11`.

## Setup

This codebase requires `dotenv v16.0.0`, `express v4.18.1`, `pg v8.7.3`, and `pg-format v1.0.4` to run at a production level and also would require `husky v7.0.0`, `jest v27.5.1`, `jest-extended v2.0.0`, `jest-sorted v1.0.14`, and `supertest v6.2.4` to develop further. This is all logged in `package.json` and so running `npm i` should install all the required packages.

To run work with this repo you will need to setup two files to handle the enviroment variables for accessing a database. These files should be called `.env.development` for the main database and `.env.test` for the test database. They should be formatted in the same way as the `.env-example` file provided using either the databse information from the `db` folder or your own databases.

The are `npm` scripts that will assist in setting up the database, running `npm run setup-dbs` will automatically set up both the development and the test databases. `npm run seed` will seed either the development or test databases depending on the `NODE_ENV` enviroment variable. There is also a script for hosting the code on heroku, once it is loaded as a heroku app add the `Heroku Postgres` add-on is setup run `npm run seed:prod` to set up the Heroku database as a production database before running `heroku open` to set up the api.

The testing suite used for this codebase is Jest, the `npm test` script is already set up to use it and there are test files for testing both the main app, `app.test.js`, and for any other custom utilities, `utils.test.js`, within the `__tests__` folder. Husky is also used to ren a testing hook before any commits are made in order to check everything is functional.

## Endpoints

### GET /api

Returns a JSON object describing all available endpoints using the `endpoints.json` file.

### GET /api/topics

Returns an array listing all available topics using `getAllTopics` and `selectAllTopics()`.

Response Format Example:

```
{ "topics": [{ "slug": "football", "description": "Footie!" }]}
```

### GET /api/articles

Returns an array listing all articles using `getAllArticles`, `selectTopicBySlug(slug)`, and `selectAllArticles()`. Can also be passed three possible queries; `topic` will filter based on the topic slug as can be seen in the pervious section, `sort_by` will select a key to sort by, and `order` takes either `asc` or `desc` to state whether response should be sorted ascendingly or decendingly. The response will also be paginated with a default size limit of 10, the limit can be changed by using the `limit` query and the page can be select using the `p` query.

Response Format Example:

```
{
"total_count": 420,
"articles": [
    {
        "title": "Seafood substitutions are increasing",
        "topic": "cooking",
        "author": "johnsmith",
        "body": "Text from the article..",
        "created_at": "2020-11-03T09:12:00.000Z",
        "comment_count": 15,
        "votes": 0,
        "article_id": 5
    }
]
}
```

### GET /api/users

Returns an array listing all users using `getAllUsers` and `selectAllUsers()`.

Response Format Example:

```
{
"users": [
    {
        "username": "johnsmith",
        "name": "john",
        "avatar_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
    }
]
}
```

### GET /api/articles/:article_id

Returns a JSON object containing the article requested using `getArticleById` and `selectArticleById(id)`.

Response Format Example:

```
{
"article": {
    "author": "johnsmith",
    "article_id": 5,
    "title": "Seafood substitutions are increasing",
    "body": "Text from the article..",
    "topic": "cooking",
    "created_at": "2020-11-03T09:12:00.000Z",
    "votes": 0,
    "comment_count": 15
    }
}
```

### PATCH /api/articles/:article_id

Updates the chosen articles `votes` value by the amount provided using `patchArticleById` and `updateArticleById(id, body)`. The body must contain the key `inc_votes` and all other keys will be ignored. Responds with the updated article.

Response Format Example:

```
{
"article": {
    "author": "johnsmith",
    "article_id": 5,
    "title": "Seafood substitutions are increasing",
    "body": "Text from the article..",
    "topic": "cooking",
    "created_at": "2020-11-03T09:12:00.000Z",
    "votes": 10,
    "comment_count": 15
    }
}
```

### GET /api/articles/:article_id/comments

Serves an array of all comments linked to the given article using `getCommentsByArticleId` and `selectCommentsByArticleId(id)`. The response will be paginated with a default size limit of 10, the limit can be changed by using the `limit` query and the page can be select using the `p` query.

Response Format Example:

```
{
"total_count": 420,
"comments": [
    {
        "comment_id": 12,
        "votes": 5,
        "created_at": "2020-11-03T09:12:00.000Z",
        "author": "johnsmith",
        "body": "Text from the comment..."
    }
]
}
```

### POST /api/articles/:article_id/comments

Adds a comment to the database linked to the chosen article using `postCommentByArticleId` and `insertCommentByArticleId(id, body)`. The body must contain the keys `username` which is a username from the users list and `body` which contains the text for the comment. All the other keys are dynamically created. Responds with the new comment.

Response Format Example:

```
{
"comments": [
    {
        "comment_id": 20,
        "votes": 0,
        "created_at": "2020-11-03T09:12:00.000Z",
        "author": "johnsmith",
        "body": "Text from the comment..."
    }
]
}
```

### DELETE /api/comments/:comment_id

Removes the chosen comment from the database using `deleteCommentById` and `removeCommentById(id)`. Returns 204 - No Content.

### GET /api/users/:username

Returns a JSON object containing the user requested using `getUserByUsername` and `selectUserByUsername(username)`.

Response Format Example:

```
{
"user": {
    "username": "lurker",
    "name": "do_nothing",
    "avatar_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
    }
}
```

### PATCH /api/comments/:comment_id

Updates the chosen comments `votes` value by the amount provided using `patchCommentById` and `updateCommentById(id, body)`. The body must contain the key `inc_votes` and all other keys will be ignored. Responds with the updated article.

Response Format Example:

```
{
"comment": {
    "comment_id": 12,
    "votes": 15,
    "created_at": "2020-11-03T09:12:00.000Z",
    "author": "johnsmith",
    "body": "Text from the comment..."
    }
}
```

### POST /api/articles

Adds a new article using `postArticle` and `insertArticle(body)`. The body must contain `author`, `title`, `body`, and `topic`. If any keys are missing then an error will be returned and any other keys will be ignored. Returns the added article.

Response Format Example:

```
{
"article": {
    "author": "johnsmith",
    "article_id": 5,
    "title": "Seafood substitutions are increasing",
    "body": "Text from the article..",
    "topic": "cooking",
    "created_at": "2020-11-03T09:12:00.000Z",
    "votes": 10,
    "comment_count": 15
    }
}
```

### POST /api/topics

Adds a new topic using `postTopic` and `insertTopic(body)`. The body must contain `slug` and `description`, `slug` must be unique or it will error back. If any keys are missing then an error will be returned and any other keys will be ignored. Returns the added topic.

Response Format Example:

```
{ "topics": [{ "slug": "football", "description": "Footie!" }]}
```

### DELETE /api/articles/:article_id

Removes the chosen article from the database using `deleteArticleById` and `removeArticleById(id)`. Returns 204 - No Content.

### GET /api/comments/:comment_id

Returns a JSON object containing the comment requested using `getCommentById` and `selectCommentById(id)`.

Response Format Example:

```
{
"comment": {
    "comment_id": 25,
    "votes": 0,
    "created_at": "2020-11-03T09:12:00.000Z",
    "author": "johnsmith",
    "body": "Text from the comment..."
    }
}
```

### GET /api/topics/:slug

Returns a JSON object containing the topic requested using `getTopicBySlug` and `selectTopicBySlug(slug)`.

Response Format Example:

```
{
"topic": {
    "slug": "cats",
    "description": "Text from the topic..."
    }
}
```

### PATCH /api/topics/:slug

Updates the `description` value of the given topic using `patchTopicBySlug` and `updateTopicBySlug(slug, body)`. Takes a body containing a `description` parameter ignoring any others, if this key is missing it will error back. Returns the updated topic.

Response Format Example:

```
{
"topic": {
    "slug": "cats",
    "description": "Text from the topic..."
    }
}
```
