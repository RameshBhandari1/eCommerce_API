const { verifyToken, verifyTokenAndAuth, verifyAdmin } = require("./verifyToken");
const Cart = require("../models/Cart");
const router = require("express").Router();

//create cart
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const saveCart = await newCart.save();
        res.status(200).json({ success: true, message: "Cart Added Succefully!!", data: saveCart });
    } catch (e) {
        res.status(500).json({ success: false, error: e });
    }
});

//Update Cart
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Cart Updated Succefully!!", data: updatedCart });
    } catch (e) {
        res.status(500).json({ success: fasle, error: e });
    }
});

//Delete Cart
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Cart Deleted Succefully!!" });
    } catch (e) {
        res.status(500).json({ success: false, error: e });
    }
});

// Get User Cart by userID
router.get("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ id: req.params.id });
        res.status(200).json({ success: true, data: cart });
    } catch (e) {
        res.status(200).json({ success: false, error: e });
    }
});

//Get All
router.get("/", verifyAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json({ success: true, data: carts });
    } catch (e) {
        res.status(200).json({ success: false, error: e });
    }
});

module.exports = router;