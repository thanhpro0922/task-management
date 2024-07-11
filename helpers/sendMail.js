const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, //@ Email của mình - Cái này mình đặt bên env để ko deploy lên
            pass: process.env.EMAIL_PASS, //@ Mật khẩu ứng dụng
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, //@ Email của mình
        to: email, //@ Email của người nhận
        subject: subject,
        html: html, //@ phải dùng cái key html đó thì lúc in ra nó tự convert sang html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
            // do something useful
        }
    });
};
