import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Email must be in ***@***.** format').isEmail(),
  body('password', 'Password must be over 5 symbols').isLength({ min: 5 }),

]
export const  registerValidation = [
  body('email', 'Email must be in ***@***.** format').isEmail(),
  body('password', 'Password must be over 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Full Name must be over 3 symbols').isLength({ min: 3 }),
  body('avatarUrl').optional().isURL(),
];

export const  postCreacteValidation = [
  body('title', 'Enter post title').isLength({ min: 3 }).isString(),
  body('text', 'Enter post text').isLength({ min: 10 }).isString(),
  body('tags', 'Inavalid tags type').optional().isString(),
  body('imgUrl', 'Invalid image url' ).optional().isString(),
];