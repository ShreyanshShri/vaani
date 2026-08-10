import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// ======================================================
// HELPERS
// ======================================================

const requiresEmailVerification = () => {
  return process.env.REQUIRE_EMAIL_VERIFICATION === "true";
};

const getFrontendBaseUrl = () => {
  return (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5173"
  );
};

// ======================================================
// GENERATE ACCESS + REFRESH TOKEN
// ======================================================

export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token hash for rotation
    user.refreshTokenHash = user.hashRefreshToken(refreshToken);

    await user.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Token generation error:", error);

    throw new ApiError(
      500,
      "Something went wrong while generating authentication tokens",
    );
  }
};

// ======================================================
// COOKIE OPTIONS
// ======================================================

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };
};

// ======================================================
// REGISTER
// ======================================================

export const registerUser = asyncHandler(async (req, res, next) => {
  const { fullname, email, username, password, phone, preferredLanguage } =
    req.body ?? {};

  // ----------------------------------------------
  // Validation
  // ----------------------------------------------

  if (
    !fullname?.trim() ||
    !email?.trim() ||
    !username?.trim() ||
    !password?.trim()
  ) {
    throw new ApiError(
      400,
      "Full name, email, username and password are required",
    );
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must contain at least 6 characters");
  }

  // ----------------------------------------------
  // Check existing user
  // ----------------------------------------------

  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // ----------------------------------------------
  // Create user
  // ----------------------------------------------

  const emailVerificationRequired = requiresEmailVerification();

  const createdUser = await User.create({
    fullname: fullname.trim(),
    email: email.toLowerCase().trim(),
    username: username.toLowerCase().trim(),
    password,
    phone: phone?.trim() || undefined,
    preferredLanguage: preferredLanguage || "en",
    isEmailVerified: !emailVerificationRequired,
  });

  // ----------------------------------------------
  // Email verification
  // ----------------------------------------------

  if (emailVerificationRequired) {
    const verificationToken = jwt.sign(
      {
        userId: createdUser._id,
        email: createdUser.email,
      },
      process.env.EMAIL_VERIFICATION_SECRET,
      {
        expiresIn: process.env.EMAIL_VERIFICATION_EXPIRY || "15m",
      },
    );

    const verificationUrl =
      `${process.env.BACKEND_URL || "http://localhost:3000"}` +
      `/api/v1/auth/verify-email?token=${verificationToken}`;

    const html = `
      <h2>Welcome to Vaani</h2>

      <p>Hello ${createdUser.fullname},</p>

      <p>
        Please verify your email address to activate your account.
      </p>

      <a href="${verificationUrl}">
        Verify Email
      </a>

      <p>
        This verification link will expire soon.
      </p>
    `;

    try {
      await sendEmail({
        email: createdUser.email,
        subject: "Verify your Vaani account",
        html,
      });
    } catch (error) {
      console.error("Verification email error:", error);

      await User.findByIdAndDelete(createdUser._id);

      throw new ApiError(
        502,
        "Could not send verification email. Please try again later.",
      );
    }
  }

  // ----------------------------------------------
  // Return safe user
  // ----------------------------------------------

  const safeUser = await User.findById(createdUser._id);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        safeUser,
        emailVerificationRequired
          ? "Account created successfully. Please verify your email."
          : "Account created successfully.",
      ),
    );
});

// ======================================================
// VERIFY EMAIL
// ======================================================

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query ?? {};

  if (!token) {
    throw new ApiError(400, "Verification token is required");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired verification token");
  }

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Email is already verified"));
  }

  user.isEmailVerified = true;

  await user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

// ======================================================
// LOGIN
// ======================================================

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body ?? {};

  if (!email && !username) {
    throw new ApiError(400, "Email or username is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  // password has select:false in User model
  const user = await User.findOne({
    $or: [
      ...(email ? [{ email: email.toLowerCase() }] : []),

      ...(username ? [{ username: username.toLowerCase() }] : []),
    ],
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email/username or password");
  }

  // ----------------------------------------------
  // Email verification check
  // ----------------------------------------------

  if (requiresEmailVerification() && !user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  // ----------------------------------------------
  // Password
  // ----------------------------------------------

  const isPasswordValid = await user.isValidPassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email/username or password");
  }

  // ----------------------------------------------
  // Generate tokens
  // ----------------------------------------------

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  // ----------------------------------------------
  // Safe user
  // ----------------------------------------------

  const loggedInUser = await User.findById(user._id);

  const cookieOptions = getCookieOptions();

  return res
    .status(200)
    .cookie("accesstoken", accessToken, cookieOptions)
    .cookie("refreshtoken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
});

// ======================================================
// LOGOUT
// ======================================================

export const logoutUser = asyncHandler(async (req, res, next) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: {
        refreshTokenHash: 1,
      },
    });
  }

  const cookieOptions = getCookieOptions();

  return res
    .status(200)
    .clearCookie("accesstoken", cookieOptions)
    .clearCookie("refreshtoken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// ======================================================
// REFRESH TOKEN
// ======================================================

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies?.refreshtoken ||
    req.cookies?.refreshToken ||
    req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  try {
    // ------------------------------------------
    // Verify JWT
    // ------------------------------------------

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    // ------------------------------------------
    // Find user
    // ------------------------------------------

    const user = await User.findById(decodedToken._id).select(
      "+refreshTokenHash",
    );

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // ------------------------------------------
    // TOKEN ROTATION CHECK
    // ------------------------------------------

    if (!user.isValidRefreshToken(incomingRefreshToken)) {
      throw new ApiError(401, "Refresh token is expired or already used");
    }

    // ------------------------------------------
    // Generate NEW token pair
    // ------------------------------------------

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    const cookieOptions = getCookieOptions();

    return res
      .status(200)
      .cookie("accesstoken", accessToken, cookieOptions)
      .cookie("refreshtoken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refreshed successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Invalid or expired refresh token",
    );
  }
});

// ======================================================
// FORGOT PASSWORD
// ======================================================

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  // Don't reveal whether account exists
  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "If an account exists with this email, a password reset link has been sent.",
        ),
      );
  }

  // ------------------------------------------
  // Generate secure reset token
  // ------------------------------------------

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedToken;

  user.passwordResetExpires = Date.now() + 15 * 60 * 1000;

  await user.save({
    validateBeforeSave: false,
  });

  // ------------------------------------------
  // Reset URL
  // ------------------------------------------

  const resetUrl =
    `${getFrontendBaseUrl()}` + `/reset-password?token=${resetToken}`;

  const html = `
      <h2>Password Reset</h2>

      <p>
        You requested to reset your Vaani password.
      </p>

      <p>
        Click the link below:
      </p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>
        This link expires in 15 minutes.
      </p>
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset your Vaani password",
      html,
    });
  } catch (error) {
    console.error("Password reset email error:", error);

    // Remove token if email failed
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    throw new ApiError(502, "Unable to send password reset email");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset link sent successfully"));
});

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;

  if (!token || !password?.trim()) {
    throw new ApiError(400, "Token and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must contain at least 6 characters");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired password reset token");
  }

  user.password = password;

  user.passwordResetToken = undefined;

  user.passwordResetExpires = undefined;

  // Invalidate old refresh token
  user.refreshTokenHash = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

// ======================================================
// CHANGE PASSWORD
// ======================================================

export const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must contain at least 6 characters");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isValidPassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;

  // Invalidate refresh token
  // Forces other sessions to authenticate again
  user.refreshTokenHash = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ======================================================
// GET CURRENT USER
// ======================================================

export const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// ======================================================
// UPDATE ACCOUNT DETAILS
// ======================================================

export const updateAccountDetails = asyncHandler(async (req, res, next) => {
  const { fullname, email, phone, preferredLanguage, timezone } = req.body;

  const updates = {};

  if (fullname?.trim()) {
    updates.fullname = fullname.trim();
  }

  if (email?.trim()) {
    updates.email = email.toLowerCase().trim();
  }

  if (phone !== undefined) {
    updates.phone = phone?.trim() || undefined;
  }

  if (preferredLanguage) {
    const allowedLanguages = ["en", "hi", "hinglish"];

    if (!allowedLanguages.includes(preferredLanguage)) {
      throw new ApiError(400, "Unsupported language");
    }

    updates.preferredLanguage = preferredLanguage;
  }

  if (timezone?.trim()) {
    updates.timezone = timezone.trim();
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No account details provided");
  }

  // If email changes, require verification again
  if (updates.email && updates.email !== req.user.email) {
    updates.isEmailVerified = false;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// ======================================================
// UPDATE AVATAR
// ======================================================

export const updateUserAvatar = asyncHandler(async (req, res, next) => {
  /*
      Keep your existing Cloudinary implementation
      here if you want profile pictures.

      Example:

      const avatarLocalPath = req.file?.path;

      if (!avatarLocalPath) {
        throw new ApiError(
          400,
          "Avatar file is missing"
        );
      }

      const avatar =
        await uploadOnCloudinary(
          avatarLocalPath
        );

      if (!avatar?.url) {
        throw new ApiError(
          500,
          "Avatar upload failed"
        );
      }

      const user =
        await User.findByIdAndUpdate(
          req.user._id,
          {
            $set: {
              avatar: avatar.url
            }
          },
          {
            new: true
          }
        );
    */

  throw new ApiError(501, "Avatar upload is not configured yet");
});
