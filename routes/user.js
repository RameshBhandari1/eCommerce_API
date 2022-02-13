const User = require("../models/User");
const router = require("express").Router();
const { verifyTokenAndAuth, verifyAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");

//Update User data
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    if (req.body.password) {
        // Using crypto-js
        req.body.password = await CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, {
            // takes every thing in req.body and set new data 
            $set: req.body
        },
            // to return new updated user, we have to write new: true
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedUser });
    } catch (e) {
        res.status(500).json(e);
    }
});

//delete user
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({ success: true, message: "User has been deleted!!" });
    } catch (e) {
        res.status(500).json(e);
    }
});

//Get User Stats 
// this router is going to return total number of user according to conditions
// for eg: total no. of users registered in March, etc.
router.get("/stats", verifyAdmin, async (req, res) => {
    //current date
    const date = new Date();
    //last year date
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        // stats per month, for that we should our items for that we can use mongodb aggregate 
        const data = await User.aggregate([
            // for condition we can use match
            // createdAt => beacause every user has this detail
            // gte => greater than
            { $match: { createdAt: { $gte: lastYear } } },
            // to take month number
            {
                $project: {
                    // this condition find month number inside createdAt from database and set in month variable
                    month: { $month: "$createdAt" },
                    // for year
                    // year: { $year: "$createdAt" }
                },
            },
            // now this is for grouping items according to month
            // for example for Janauary it will be 1, for march it will be 3 and so on..
            {
                $group: {
                    _id: "$month",
                    // to sum total number of users
                    total: { $sum: 1 }
                },
            }
        ]);
        res.status(200).json({ success: true, data: data });
    } catch (e) {
        res.status(500).json(e);
    }
});


//Get User by ID
router.get("/:id", verifyAdmin, async (req, res) => {
    try {
        // find user by id
        const user = await User.findById(req.params.id);
        // filter user's data
        const { password, ...others } = user._doc;
        res.status(200).json({ success: true, data: others, message: "User founded!!" });
    } catch (e) {
        res.status(500).json(e);
    }
});

// Get All Users
router.get("/", verifyAdmin, async (req, res) => {
    // using query we can patch leatest 5 user or we can set limit also 
    // where new is a variable of our query in url
    // we can write in url = localhost:3001/api/users/?new=true
    const query = req.query.new;
    try {
        // apply condition with query while finding users
        //(query ? await User.find().sort({ _id: -1 }).limit(5) ) => this condition will return leatest top 5 users data 
        const users = query ? await User.find().sort({ _id: -1 }).limit(1) : await User.find();
        res.status(200).json({ success: true, data: users })
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = router;