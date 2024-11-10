import express from 'express';
import bodyParser from "body-parser";
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let posts = [];

// Route to view all posts
app.get('/', (req, res) => {
  res.render('posts', { posts });
});

// Route to view a single post by ID
app.get('/post/:id', (req, res) => {
  const postId = req.params.id;
  const post = posts.find(p => p.id === postId);
  if (post) {
    res.render('post-details', { post });
  } else {
    res.status(404).send('Post not found');
  }
});

// Route to show form for adding a new post
app.get('/new-post', (req, res) => {
  res.render('new-post');
});

app.post('/delete-post/:id', (req, res) => {
  const postId = req.params.id;
  const post = posts.find(p => p.id === postId);
  const index = posts.indexOf(post);
  if (index > -1) { // only splice array when item is found
    posts.splice(index, 1); // 2nd parameter means remove one item only
  }
  res.redirect('/');
});


// Route to handle adding a new post
app.post('/add-post', (req, res) => {
  const { title, content } = req.body;
  let id = 0;
  if (posts.length) {
    id = (parseInt(posts[posts.length - 1].id) + 1).toString();
  } else {
    id = (posts.length + 1).toString();
  }
  const newPost = {
    id: id, // Unique ID for the post
    title,
    content,
  };
  posts.push(newPost);
  res.redirect('/');
});


// Route to handle editing a  post
app.post('/edit-post/:id', (req, res) => {
  const postId = req.params.id;
  const post = posts.find(p => p.id === postId);

  if (post) {
    res.render('edit-post', { post });
  } else {
    res.status(404).send('Post not found');
  }
});


// Route to handle adding a new post
app.post('/update/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const newPost = {
    id: postId,
    title,
    content,
  };
  const postsCopy = posts.map(p =>
    p.id === newPost.id ?
      newPost : p);

  posts = postsCopy;
  res.redirect('/');

});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
