const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        // get token from user
        const authHeader = req.headers.token;
        // verify token
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
                //if error occurred or token expired
                if (err) res.status(403).json("Token is not valid!");
                // store all data of user in req.user
                req.user = user;
                next();
            })
        } else {
            return res.status(401).json("You are not aunthenticated!");
        }
    } catch (e) {
        res.status(401).json("You are not aunthenticated!");
    }
}

//for both admin and user verification
const verifyTokenAndAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.user_id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed!");
        }
    });
}

//for admin verification (to add, update, delete products and orders)
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not aunthenticated!");
        }
    })
}

// we use bracket here because we are going to export multiple functions
module.exports = { verifyToken, verifyTokenAndAuth, verifyAdmin };