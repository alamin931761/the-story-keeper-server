const config = require("../../../config");
const stripe = require("stripe")(config.stripe_secret_key);

const paymentService = async (total) => {
  const amount = parseInt(total * 100); // stripe expects the amount to be specified in the smallest currency unit.
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  return { clientSecret: paymentIntent.client_secret };
};

module.exports = paymentService;
