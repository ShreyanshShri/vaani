import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    verifyEmail,
    forgotPassword,
    resetPassword,
    changeCurrentPassword,
    getCurrentUser,
    updateProfile,
    generateAccessAndRefreshToken,
} from "../controllers/auth.controller.js";

import {
    verifyJWT,
} from "../middlewares/auth.middleware.js";

import passport from "../passport.js";

const router = Router();


// =====================================================
// LOCAL AUTHENTICATION
// =====================================================

// Register
router.post(
    "/register",
    registerUser
);


// Login
router.post(
    "/login",
    loginUser
);


// Logout
router.post(
    "/logout",
    verifyJWT,
    logoutUser
);


// =====================================================
// JWT TOKEN MANAGEMENT
// =====================================================

// Refresh access token
// Rotates refresh token as well
router.post(
    "/refresh-token",
    refreshAccessToken
);


// =====================================================
// EMAIL VERIFICATION
// =====================================================

// Verify email
router.get(
    "/verify-email",
    verifyEmail
);


// =====================================================
// PASSWORD MANAGEMENT
// =====================================================

// Forgot password
router.post(
    "/forgot-password",
    forgotPassword
);


// Reset password
router.post(
    "/reset-password",
    resetPassword
);


// Change password
router.post(
    "/change-password",
    verifyJWT,
    changeCurrentPassword
);


// =====================================================
// GOOGLE OAUTH
// =====================================================

// Step 1:
// Frontend sends user to:
// GET /api/v1/auth/google
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);


// Step 2:
// Google redirects here
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
    }),
    async (req, res, next) => {

        try {

            const user = req.user;

            if (!user) {
                return res.redirect(
                    `${process.env.FRONTEND_URL}/login?error=oauth_failed`
                );
            }

            const {
                accesstoken,
                refreshtoken,
            } = await generateAccessAndRefreshToken(user._id);


            /*
             * Ideally, do NOT expose the refresh token
             * in the URL.
             *
             * For now we send the access token to the
             * frontend callback.
             */

            const frontendUrl =
                process.env.FRONTEND_URL ||
                "http://localhost:5173";


            return res.redirect(
                `${frontendUrl}/oauth/callback?token=${encodeURIComponent(
                    accesstoken
                )}`
            );

        } catch (error) {

            console.error(
                "Google OAuth callback error:",
                error
            );

            return res.redirect(
                `${process.env.FRONTEND_URL}/login?error=oauth_failed`
            );
        }
    }
);


// =====================================================
// USER
// =====================================================

// Get logged-in user
router.get(
    "/current-user",
    verifyJWT,
    getCurrentUser
);


// Update basic profile
router.patch(
    "/update-profile",
    verifyJWT,
    updateProfile
);


export default router;

