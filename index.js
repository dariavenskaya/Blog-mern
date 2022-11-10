import express from "express";
import mongoose from "mongoose";
import multer from 'multer';
import cors from 'cors'
import { registerValidation, loginValidation, postCreacteValidation } from './validations.js'
import checkAuth from './utils/checkAuth.js'
import { register, login, getMe } from './controllers/UserController.js'
import { create, getAll, getLastTags, getOne, remove, update } from './controllers/PostController.js'
import handleValidationErrors from "./utils/handleValidationErrors.js";

const app = express();

app.use(express.json());
app.use(cors())
const url = 'mongodb://localhost:27017/blog';

app.use('/uploads', express.static('uploads'))

mongoose
  .connect(url)
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB error', err));

app.get('/', (req, res) => {
  res.send('hi')
});

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, 'uploads')
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname)
  }
})

const upload = multer({ storage });

//users
app.post('/auth/login', loginValidation, handleValidationErrors, login)
app.get('/auth/me', checkAuth, getMe)
app.post('/auth/register', registerValidation, handleValidationErrors, register)

app.get('/tags', getLastTags);

//posts
app.get('/posts/tags', getLastTags);
app.get('/posts', getAll);
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreacteValidation, handleValidationErrors, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, postCreacteValidation, handleValidationErrors, update);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.listen(4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('server is fine')
})