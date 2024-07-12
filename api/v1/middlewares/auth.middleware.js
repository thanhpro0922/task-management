const User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne({
            token: token,
            deleted: false,
        }).select("-password");
        if (!user) {
            res.json({
                code: 400,
                message: "Token không hợp lệ!",
            });
            return;
        }

        req.user = user; //@@ cái req.user mình tự định nghĩa chứ ko phải cs sẵn mà gán đâu
        next();
    } else {
        res.json({
            code: 400,
            message: "Vui lòng gửi kèm token!",
        });
    }
};
