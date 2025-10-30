import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js"; // adjust path if needed

dotenv.config();

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

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            password: null,
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Google Auth Error:", err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then((user) => done(null, user)));

export default passport;
