const isCouponExpired = (date) => {
  // convert the dates to milliseconds
  const currentTime = new Date().getTime();
  const couponExpiryTime = new Date(date).getTime();

  if (currentTime > couponExpiryTime) {
    return true;
  } else {
    return false;
  }
};

module.exports = isCouponExpired;
