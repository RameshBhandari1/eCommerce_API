require("./database/dbconnection");
const express = require("express");
const app = express();
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const authRoute = require("./routes/auth");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(process.env.PORT || 99, () => {
    console.log('Server is running in port:' + process.env.PORT);
});

