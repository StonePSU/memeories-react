'use strict';
const path = require('path');
const TwitterTokenStrategy = require('passport-twitter-token');
const User = require(path.join(process.cwd(), 'app', 'models', 'users.js'));

module.exports = function(passport) {
  passport.use(new TwitterTokenStrategy({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callbackURL: "https://react-apps-stone-psu.c9users.io/auth/twitter/callback"
  }, function(token, tokenSecret, profile, done) {
    
    // find the user.  If one doesn't exist then create a new user
    let q = User.findOne({'twitter.id': profile.id});
    q.then((user) => {
      if (!user) {
        const newUser = new User;
        newUser.twitter.id = profile.id;
        newUser.twitter.username = profile.username;
        newUser.twitter.displayName = profile.displayName;
        newUser.save(function(err, results) {
          if (err) {
            return done(err)
          }
          
          return done(null, newUser);
        })
      } else {
        return done(null, user);
      }
    })
    .catch((err) => {
      return done(err);
    })
  }));
  
}