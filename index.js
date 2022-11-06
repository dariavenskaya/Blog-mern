import express from "express";
import mongoose from "mongoose";
import { registerValidation, loginValidation, postCreacteValidation } from './validations.js'
import checkAuth from './utils/checkAuth.js'
import { register, login, getMe } from './controllers/UserController.js'
import { create, getAll, getOne, remove, update } from './controllers/PostController.js'

const app = express();

app.use(express.json());
const url = 'mongodb://localhost:27017/blog';

mongoose
  .connect(url)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

app.get('/', (req, res) => {
  res.send('hi')
});

//users
app.post('/auth/login', loginValidation, login)
app.get('/auth/me', checkAuth, getMe)
app.post('/auth/register', registerValidation, register)

//posts
app.get('/posts', getAll);
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreacteValidation, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, update);

app.listen(4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('server is fine')
})