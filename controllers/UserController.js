
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator';
import User from '../models/User.js'
import bcrypt from "bcrypt"

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }
  
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt);
    const doc = new User({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });
    const user = await doc.save();
    const token = jwt.sign({
      _id: user._id
    }, 
    'secret123',
    {
      expiresIn: '30d'
    }
    )
    const { passwordHash, ...userData} = user._doc;
    res.json({
      ...userData,
      token
    })  

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot register'
    })
  }

}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    const { passwordHash, ...userData} = user._doc;
    res.json(userData)
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'no access'
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if(!isValidPassword) {
      return res.status(400).json({
        message: 'Invalid login or password'
      })
    }
    const token = jwt.sign({
      _id: user._id
    }, 
    'secret123',
    {
      expiresIn: '30d'
    }
    )
    const { passwordHash, ...userData} = user._doc;
    res.json({
      ...userData,
      token
    })  
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Cannot authorize'
    })
  }
}