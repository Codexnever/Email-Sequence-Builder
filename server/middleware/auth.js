const jwt = require("jsonwebtoken")
const User = require("../models/User")

/**
 * Here we are creating a middleware function that will check if the user is authenticated
 * by verifying the JWT token sent in the request header.
 */
module.exports = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token")

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.user.id).select("-password")

    next()
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" })
  }
}
