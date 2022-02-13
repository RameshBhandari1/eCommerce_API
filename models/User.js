const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: [true, "Fullname is required !!"]
        },
        username: {
            type: String,
            required: [true, "Username is required !!"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required !!"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required !!"]
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);