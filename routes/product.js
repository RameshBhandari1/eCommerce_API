const router = require("express").Router();
const Product = require("../models/Product");
const { verifyAdmin, verifyToken } = require("./verifyToken");

//Create Product
router.post("/", verifyAdmin, async (req, res) => {
    // Get Every details of product from body
    const newProduct = new Product(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json({ success: true, data: saveProduct, message: "Product added successfully!" });
    } catch (e) {
        res.status(500).json({ success: false, error: e });
    }

});

//Update Product
router.put("/:id", verifyAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedProduct, message: "Product updated succefully!!" });
    } catch (e) {
        res.status(500).json({ success: fasle, error: e });
    }
});

//Delete Product
router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product Deleted Succefully!!" });
    } catch (e) {
        res.status(500).json({ success: false, error: e });
    }
});

// Get product by ID
router.get("/:id", async (req, res) => {
    try {
        await Product.findById(req.params.id)
            .then(product => {
                res.status(200).json({ success: true, data: product });
            });
    } catch (e) {
        res.status(200).json({ success: false, error: e });
    }
});

//Get all product
router.get("/", async (req, res) => {
    // Query by using Created date
    const query = req.query.new;
    // Query by using Product category
    const qCategory = req.query.category;
    try {
        let products;
        if (query) {
            products = await Product.find().sort({ _id: -1 }).limit(5);
        } else if (qCategory) {
            // if qCategory is inside categories than it will fectch product data
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            });
        } else {
            products = await Product.find();
        }
        res.status(200).json({ success: true, data: products })
    } catch (e) {
        res.status(500).json({ success: fasle, error: e });
    }
});

module.exports = router;