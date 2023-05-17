const jwt = require('jsonwebtoken')
const validator = require('validator');
const ErrorResponse = require("../utils/errorResponse")
const User = require('../models/userModel')
const bcrypt = require('bcrypt');


const generateToken = async (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

const signupUser = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        // check for empty fields
        if (!name || !email || !password) {
            throw new Error("All fields are required")
        }

        // check if email is a valid email address
        if (!validator.isEmail(email)) {
            throw new Error("oop! email is not valid")
        }
        
        // check if password id up to six character long 
        if (password.length < 6) { 
            throw new Error("password must be atleast six character long")
        }

        // check if user with email already exists
        const userExists = await User.findOne({ email })

        if (userExists) {
            throw new Error("Email already exists")
        }

        // hasing the passowrd as a security measure 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        // generateToken
        const token = await generateToken(user._id)

        res.cookie("token", token, {
            path: "/",
            // httpOnly: true,
            expires: new Date(Date.now() + ( 1000 * 86400)),
            sameSite:"none",
            secure: true
        })

        if(user) {
            const { _id, name, email, password } = user
            res.status(200).json({
                _id, 
                name,
                email, 
                token
            })
        } else {
            throw new Error("Registration failed")
        }

    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    try {

        if (!email || !password) {
            throw new Error("Fill all fields")
        }

        if (!validator.isEmail(email)) {
            throw new Error("Not a valid email address")
        }
        
        const user = await User.findOne({ email })

        if (!user) {
            throw new Error("Invalid email or password")
        }

        const hashedPassword = await bcrypt.compare(password, user.password)
        const token = await generateToken(user._id)
        
        res.cookie("token", token,{
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), 
            sameSite: "none",
            // secure: true
        })
  
        if(user && hashedPassword) {
            const { _id, name, email, password } = user
            res.status(200).json({
            _id,
            name,
            email,
            password,
            token
            })
        } else {
            throw new Error("Invalid email or password")
        }

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const logoutUser = async (req, res) => {
   res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        sameSite: "none",
        expires: new Date(0),
        secure: true
    })
    return res.status(200).json({message: "Successfully Logged out"})
}


module.exports = {
    signupUser,
    loginUser,
    logoutUser
}