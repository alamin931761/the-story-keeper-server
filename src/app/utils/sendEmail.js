const nodemailer = require("nodemailer");
const config = require("../../config");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: config.node_env === "production",
      auth: {
        user: "alamin931761@gmail.com",
        pass: "nxfy crbn rnes gzly",
      },
    });

    await transporter.sendMail({
      from: "alamin931761@gmail.com",
      to,
      subject,
      text: "",
      html,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendEmail;
