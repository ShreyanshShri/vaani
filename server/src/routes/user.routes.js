import { Router } from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  generateAccessAndRefreshToken,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// =====================================================
// AUTHENTICATION
// =====================================================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", verifyJWT, logoutUser);

// Refresh access token
router.post("/refresh-token", refreshAccessToken);

// =====================================================
// GOOGLE OAUTH
// =====================================================

import passport from "../passport.js";

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      const { accesstoken, refreshtoken } = await generateAccessAndRefreshToken(
        user._id,
      );

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      res.redirect(
        `${frontendUrl}/oauth/callback?token=${encodeURIComponent(
          accesstoken,
        )}`,
      );
    } catch (error) {
      console.error("Google OAuth error:", error);

      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  },
);

// =====================================================
// EMAIL VERIFICATION
// =====================================================

// Verify email
router.get("/verify-email", verifyEmail);

// =====================================================
// PASSWORD
// =====================================================

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

// Change password - requires authentication
router.post("/change-password", verifyJWT, changeCurrentPassword);

// =====================================================
// CURRENT USER
// =====================================================

// Get logged-in user
router.get("/current-user", verifyJWT, getCurrentUser);

export default router;
