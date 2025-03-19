import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findUserByEmail, createUser } from "../models/userModel.js"; // Adjust with your model
import { generateToken } from "../utils/jwtUtility.js"; // Adjust JWT token generation

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth Profile:", profile);
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);

        const email = profile.emails[0].value;
        let user = await findUserByEmail(email);

        if (!user) {
          user = await createUser(profile.displayName, email);
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, { id });
});

export default passport;
