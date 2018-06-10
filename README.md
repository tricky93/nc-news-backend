## Portfolio News API

### Background

This is my news API created while completing the 12 week coding bootcamp at Northcoders in Manchester.

This project is hosted on heroku at https://nc-news-portfolio.herokuapp.com/ while the database is stored on mLab.

The API has numerous endpoints that will serve JSON objects to the browser, these are listed below.

- GET /api/topics
  Get all the topics

- GET /api/topics/:topic/articles
  Return all the articles for a certain topic

- GET /api/articles
  Return all the articles

- GET /api/articles/:article_id/comments
  Get all the comments for a individual article

- POST /api/articles/:article_id/comments
  Add a new comment to an article. This route requires a JSON body with a comment key and value pair
  e.g: {"comment": "This is my new comment"}

- PUT /api/articles/:article_id
  Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
  e.g: https://nc-news-portfolio.herokuapp.com/api/articles/:article_id?vote=up

- PUT /api/comments/:comment_id
  Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
  e.g: https://nc-news-portfolio.herokuapp.com/api/comments/:comment_id?vote=down
- DELETE /api/comments/:comment_id
  Deletes a comment if the comment was created by the Northcoder user

- GET /api/users/:username
  Returns a JSON object with the profile data for the specified user.

I can confirm this news api is 100% unofficial!!!

### Dependencies

    body-parser: "^1.18.3",
    ejs: "^2.6.1",
    express: "^4.16.3",
    mongoose: "^5.1.4"

### Built With

- [Express](https://expressjs.com/) - The web application framework used
- [mongoDB](https://www.mongodb.com) - The database used

### Authors

- Paddy Walsh

### Acknowledgements

- [Northcoders](https://northcoders.com/) - A coding education like no other
