const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers
    try {

        if (!authorization) {
            throw new Error('Authorization token required')
        }

        const token = authorization.split(' ')[1];

         // verify token 
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // get user id from token 
        const user = await User.findOne({ _id: verified.id }).select("_id")
        
        req.user = user;

        next()
        
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
 
module.exports = requireAuth