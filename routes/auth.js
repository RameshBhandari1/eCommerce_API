const User = require("../models/User");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
// const bcrypt = require("bcrypt");

//Register
router.post("/register", async (req, res) => {
    try {
        //Get User inputs
        const { full_name, username, password, email } = req.body;

        if (!(full_name && username && password && email)) {
            res.status(400).send({ success: false, message: "All fields are required !!" });
        }

        //validation for existing user
        const oldEmail = await User.findOne({ email });

        if (oldEmail) {
            return res.status(409).send({ success: false, message: "User already exist. Please Login !!" });
        }
        // Using bcrypt hash  
        // encryptedPassword = await bcrypt.hash(password, 10);

        // Using crypto-js
        encryptedPassword = await CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();

        //create User in Database
        const user = await User.create({
            full_name,
            username,
            email: email.toLowerCase(), // convert email in lowercase
            password: encryptedPassword,

        });

        //sending response
        res.status(201).json({ success: true, data: user });
    } catch (e) {
        res.status(500).json(e);
    };
});

//Login
router.post("/login", async (req, res) => {
    try {
        //Get User inputs
        const { username, password1 } = req.body;

        if (!username || !password1) {
            return res.status(403).json({
                success: false,
                message: "Please insert Username or Password!!"
            });
        }

        // Checking Username and Password
        await User.findOne({ username: username })
            .then(user => {
                // condition check for username
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid Credentials!"
                    });
                }

                // For decrypting hashpassword
                const decryptPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

                //to convert into string (if we are using in other character -> CryptoJS.enc.uft8)
                const userPassword = decryptPassword.toString(CryptoJS.enc.Utf8);

                // condition check for password 
                if (userPassword !== password1) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid Credentials!"
                    });
                }
                //filter password from user info
                const { password, ...others } = user._doc;

                //create token
                const token = jwt.sign(
                    { user_id: user._id, isAdmin: user.isAdmin },
                    process.env.TOKEN_KEY,
                    { expiresIn: "3d" }
                );

                //Save Token
                user.token = token;

                res.status(200).json({ success: true, message: "Login Successfully!", user: others, token: token });
            });

    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;