const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")

/**
 * This file contains the routes for user authentication
 * Routes: /register, /login, and /user (protected)
 */

// Helper to check if JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.")
  process.exit(1)
}

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] })
      }

      // Create new user
      user = new User({
        name,
        email,
        password,
      })

      // Save user to database
      await user.save()

      const payload = {
        user: {
          id: user.id,
        },
      }

      // Sign JWT and send response
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
        if (err) {
          console.error("JWT sign error:", err)
          return res.status(500).send("Server error")
        }
        res.json({ token })
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
)

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      // Check if user exists
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
      }

      // Check password match (assuming comparePassword method is implemented)
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
        if (err) {
          console.error("JWT sign error:", err)
          return res.status(500).send("Server error")
        }
        res.json({ token })
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
)

// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    // Assuming auth middleware attaches the user info in req.user
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

module.exports = router
