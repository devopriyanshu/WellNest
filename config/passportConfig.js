import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import CentralUserModel from '../models/centralUserModel.js';
import { googleSignIn } from '../services/authService.js';
import { generateToken } from '../utils/jwtUtility.js';
import logger from '../utils/logger.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        logger.info(`Google OAuth attempt for: ${email}`);

        // Use auth service for Google sign in
        const result = await googleSignIn(googleId, email, name);

        // Return user with token
        return done(null, {
          ...result.user,
          token: result.token,
        });
      } catch (error) {
        logger.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

// Stateless authentication - no serializeUser/deserializeUser needed

export default passport;
