const { verifyToken, verifyTokenAndAuth, verifyAdmin } = require("./verifyToken");
const Order = require("../models/Order");
const router = require("express").Router();

//create Order
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const saveOrder = await newOrder.save();
        res.status(200).json({ success: true, message: "Order Added Succefully!!", data: saveOrder });
    } catch (e) {
        res.status(500).json({ success: false, error: e });
    }
});

//Update Order
router.put("/:id", verifyAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Order Updated Succefully!!", data: updatedOrder });
    } catch (e) {
        res.status(500).json({ success: fasle, error: e });
    }
});

//Delete Order
router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Order Deleted Succefully!!" });
    } catch (e) {
        res.status(500).json({ success: false, error: e });
    }
});

// Get User Order by userID
router.get("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const orders = await Order.find({ id: req.params.id });
        res.status(200).json({ success: true, data: orders });
    } catch (e) {
        res.status(200).json({ success: false, error: e });
    }
});

//Get All
router.get("/", verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ success: true, data: orders });
    } catch (e) {
        res.status(200).json({ success: false, error: e });
    }
});

//Get MOnthly Income
router.get("/income", verifyAdmin, async (req, res) => {
    //current date
    const date = new Date();
    //last Month date
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    //Previous Month date
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
    try {
        // stats per month, for that we should our items for that we can use mongodb aggregate 
        const income = await Order.aggregate([
            // for condition we can use match
            // createdAt => beacause every order has this detail
            // gte => greater than
            { $match: { createdAt: { $gte: previousMonth } } },
            // to take month number
            {
                $project: {
                    // this condition find month number inside createdAt from database and set in month variable
                    month: { $month: "$createdAt" },
                    // for sales
                    sales: "$amount",
                },
            },
            // now this is for grouping items according to month
            // for example for Janauary it will be 1, for march it will be 3 and so on..
            {
                $group: {
                    _id: "$month",
                    // to sum total number of users
                    total: { $sum: "$sales" }
                },
            }
        ]);
        res.status(200).json({ success: true, data: income });
    } catch (e) {
        res.status(200).json({ success: false, error: e });
    }
});

module.exports = router;