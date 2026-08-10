import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./models/user.model.js";

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const avatar = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error("Google account has no email"), null);
          }

          // Existing Google user
          let existingUser = await User.findOne({
            googleId: profile.id,
          });

          if (existingUser) {
            return done(null, existingUser);
          }

          // Existing account with same email
          existingUser = await User.findOne({
            email: email.toLowerCase(),
          });

          if (existingUser) {
            existingUser.googleId = profile.id;
            existingUser.isEmailVerified = true;

            if (avatar && !existingUser.avatar) {
              existingUser.avatar = avatar;
            }

            await existingUser.save({
              validateBeforeSave: false,
            });

            return done(null, existingUser);
          }

          // Create new Google user
          const username =
            profile.displayName
              ?.toLowerCase()
              .replace(/[^a-z0-9]/g, "")
              .slice(0, 20) + Math.floor(Math.random() * 10000);

          const newUser = await User.create({
            fullname: profile.displayName,
            username,
            email: email.toLowerCase(),
            googleId: profile.id,
            avatar: avatar || "",
            isEmailVerified: true,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
}

export default passport;
