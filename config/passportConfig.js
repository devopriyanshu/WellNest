import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findUserByEmail, createUser } from "../models/centralUserModel.js";
import { generateToken } from "../utils/jwtUtility.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth Profile:", profile);

        const email = profile.emails[0].value;
        let user = await findUserByEmail(email);

        if (!user) {
          user = await createUser(
            profile.displayName,
            email,
            null,
            "user",
            "google"
          );
        }

        // ✅ Generate JWT Token
        console.log("User before token:", user);
        const token = generateToken(user.id, user.role);

        // ✅ Pass user and token
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
