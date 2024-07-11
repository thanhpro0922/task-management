const mongoose = require("mongoose");
const forgotPassWordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 0,
        },
    },
    { timestamps: true }
);
const ForgotPassword = mongoose.model(
    "ForgotPassword",
    forgotPassWordSchema,
    "forgot-password"
);

module.exports = ForgotPassword;
