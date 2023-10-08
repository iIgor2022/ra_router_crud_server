/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(
  bodyParser.json({
    type() {
      return true;
    }
  })
);

app.use((request, response, next) => {
  response.setHeader("Content-Type", "application/json");
  next();
});

let posts = [];
let nextId = 1;

app.get('/posts', (request, response) => response.send(JSON.stringify(posts)));

app.get('/posts/:id', (request, response) => {
  const postId = Number(request.params.id);
  const index = posts.findIndex(item => item.id === postId);

  response.send(JSON.stringify({ post: posts[index] }));
});

app.post('/posts', (request, response) => {
  const index = posts.findIndex((item) => item.id === request.body.id);

  if (index === -1) {
    posts.push({
      ...request.body,
      id: nextId++,
      created: Date.now()
    });
  } else {
    posts[index].content = request.body.content;
  }

  response.status(204).end();
});

app.put('/posts/:id', (request, response) => {
  const postId = Number(request.params.id);

  posts = posts.map(item => {
    if (item.id === postId) {
      return {
        ...item,
        ...request.body,
        id: item.id
      }
    }

    return item;
  });

  response.status(204).end();
});

app.delete('/posts/:id', (request, response) => {
  const postId = Number(request.params.id);
  const index = posts.findIndex(item => item.id === postId);

  if (index !== -1) posts.splice(index, 1);

  response.status(204).end();
});

const port = process.env.PORT || 7070;

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));