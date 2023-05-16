const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse")

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.token
        
        if (!token) {
            next(new ErrorResponse("Not authorized, please login", 401))
            return
        }

        // verify token 
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // get user id from token 
        const user = await User.findById(verified.id).select("-password")


        if (!user) {
            next(new ErrorResponse("user not found", 401))
            return
        }

        req.user = user;
        next()

    } catch (error) {
        res.status(401).json({error: error.message})
    }
}

module.exports = auth