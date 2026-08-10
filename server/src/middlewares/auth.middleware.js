import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apierror.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// =====================================================
// VERIFY JWT
// =====================================================

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accesstoken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id)
            .select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        req.user = user;

        next();

    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Invalid access token"
        );
    }
});

// =====================================================
// OPTIONAL JWT
// =====================================================
//
// Useful for endpoints that work both for:
// authenticated users
// and
// guests.
//
// Example:
// GET /api/v1/medical/public-info
//
// If a valid token exists → req.user is available.
// If there is no/invalid token → request continues.
//

export const optionalVerifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accesstoken ||
    req.header("Authorization")?.replace("Bearer ", "");

  // No token → continue as guest
  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshtoken",
    );

    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Don't block public endpoints because
    // of an expired/invalid optional token.
    req.user = null;
  }

  next();
});
