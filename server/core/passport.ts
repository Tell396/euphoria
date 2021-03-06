import passport from 'passport';
import { Strategy as GithubStrategy } from 'passport-github';
import dotenv from 'dotenv';
const { User } = require('../models');

// TODO: Add Google and VK auth

dotenv.config({
  path: 'server/.env',
});

passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: '95d7d398e883410e18f4',
      clientSecret: 'a6c8382892022f74d1a0e7d91e084f00a4e56fcf',
      callbackURL: 'http://localhost:3001/auth/github/callback',
    },
    async (_: unknown, __: unknown, profile, done) => {
      try {
        const obj = {
          fullname: profile.displayName,
          avatarUrl: profile.photos?.[0].value,
          isActive: 0,
          username: profile.username,
          phone: '',
        };

        const findUser = await User.findOne({
          where: {
            username: obj.username 
          }
        });

        if (!findUser) {
          const user = await User.create(obj);
          return done(null, user.toJSON());
        }

        done(null, findUser);
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    err ? done(err) : done(null, user);
  });
});

export { passport };
