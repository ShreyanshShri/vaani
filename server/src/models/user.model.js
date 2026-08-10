import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new Schema(
	{
		// =========================
		// BASIC USER INFORMATION
		// =========================

		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},

		fullname: {
			type: String,
			required: true,
			trim: true,
		},

		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},

		phone: {
			type: String,
			trim: true,
			unique: true,
			sparse: true,
		},

		// =========================
		// AUTHENTICATION
		// =========================

		password: {
			type: String,
			select: false,
		},

		googleId: {
			type: String,
			unique: true,
			sparse: true,
			index: true,
		},

		// =========================
		// EMAIL VERIFICATION
		// =========================

		isEmailVerified: {
			type: Boolean,
			default: false,
		},

		emailVerificationToken: {
			type: String,
			select: false,
		},

		emailVerificationExpiry: {
			type: Date,
			select: false,
		},

		// =========================
		// PASSWORD RESET
		// =========================

		passwordResetToken: {
			type: String,
			select: false,
		},

		passwordResetExpires: {
			type: Date,
			select: false,
		},

		// =========================
		// REFRESH TOKEN
		// =========================

		refreshTokenHash: {
			type: String,
			select: false,
		},

		// =========================
		// USER PREFERENCES
		// =========================

		preferredLanguage: {
			type: String,
			enum: ["en", "hi", "hinglish"],
			default: "en",
		},

		timezone: {
			type: String,
			default: "Asia/Kolkata",
		},
	},
	{
		timestamps: true,
	},
);

// ========================================
// PASSWORD HASHING
// ========================================

userSchema.pre("save", async function () {
	if (!this.isModified("password")) {
		return;
	}

	// Google-only accounts don't have a password
	if (!this.password) {
		return;
	}

	this.password = await bcrypt.hash(this.password, 10);
});

// ========================================
// PASSWORD VALIDATION
// ========================================

userSchema.methods.isValidPassword = async function (password) {
	if (!this.password) {
		return false;
	}

	return bcrypt.compare(password, this.password);
};

// ========================================
// ACCESS TOKEN
// ========================================

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			fullname: this.fullname,
		},
		process.env.ACCESS_TOKEN_SECRET || "dev-access-secret",
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
		},
	);
};

// ========================================
// REFRESH TOKEN
// ========================================

userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret",
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
		},
	);
};

// ========================================
// HASH REFRESH TOKEN
// ========================================

userSchema.methods.hashRefreshToken = function (token) {
	return crypto.createHash("sha256").update(token).digest("hex");
};

// ========================================
// VERIFY REFRESH TOKEN
// ========================================

userSchema.methods.isValidRefreshToken = function (token) {
	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

	return hashedToken === this.refreshTokenHash;
};

export const User = mongoose.model("User", userSchema);
