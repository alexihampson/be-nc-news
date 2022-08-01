# Northcoders News API

## Setup

To run work with this repo you will need to setup two files to handle the enviroment variables for accessing a database. These files should be called `.env.development` for the main database and `.env.test` for the test database. They should be formatted in the same way as the `.env-example` file provided using either the databse information from the `db` folder or your own databases.

## Endpoints

### GET /api/topics

Uses `getAllTopics()` and `selectAllTopics()` in `topics.js` in `controllers` and `models` respectively to return an object with one key of `topics` which points to an array of all topic objects with `slug` and `description` keys.
