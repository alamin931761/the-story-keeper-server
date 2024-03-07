const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(process.cwd(), ".env") });

module.exports = {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  database_url: process.env.DATABASE_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  email_sender_key: process.env.EMAIL_SENDER_KEY,
  email_sender: process.env.EMAIL_SENDER,
};
