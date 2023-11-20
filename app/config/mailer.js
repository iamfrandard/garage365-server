const nodemailer = require("nodemailer");

const send = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "danielchalasrd@gmail.com",
    pass: "xwgj bpli axmv dxgz",
  },
});

send.verify().then(() => {
  console.log("NodeMailer - READY");
});

module.exports = {
  send,
};
