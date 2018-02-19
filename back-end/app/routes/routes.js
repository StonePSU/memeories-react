'use strict';
const path = require('path');
const apiHandler = require(path.join(process.cwd(), 'app', 'controller', 'apiHandler.server.js'));
const authMiddleware = require(path.join(process.cwd(), 'app', 'middleware', 'apiSecurity.js'));
const apiMiddleware = require(path.join(process.cwd(), 'app', 'middleware', 'apiSecurity.js'));
const request = require('request');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

module.exports = function(app, passport) {
  
  //token handling middleware
  const authenticate = expressJwt({
    secret: 'my-secret',
    requestProperty: 'auth',
    getToken: function(req) {
      if (req.headers['x-auth-token']) {
        return req.headers['x-auth-token'];
      }
      return null;
    }
  });
  
  const createToken = function(auth) {
    return jwt.sign({
      id: auth.id
    }, 'my-secret',
    {
      expiresIn: 60 * 120
    });
  };
  
  const generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    return next();
  };
  
  const sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
  };
  
  // twitter authentication
  app.post('/auth/twitter/reverse', function(req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
      }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }

      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.send(JSON.parse(jsonStr));
    });
  });
  
  app.post('/auth/twitter', (req, res, next) => {
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }

      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);

      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;

      next();
    });
  }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }

      // prepare token for API
      req.auth = {
        id: req.user.id
      };

      return next();
    }, generateToken, sendToken)
  
  // apis
  app.get('/api/auth', apiHandler.checkAuth);
  app.get('/api/images', apiHandler.getImages);
  app.post('/api/images', authenticate, apiHandler.addImage);
  app.get('/api/images/users', authenticate, apiHandler.getImagesForCurrentUser);
  app.delete('/api/images/:id', authenticate, apiHandler.deleteImage);
  app.patch('/api/images/:id', authenticate, apiHandler.toggleLike);
  app.get('/api/users', authenticate, apiHandler.getUsers);
  app.get('/api/user', authenticate, apiHandler.getUserInfo);
}