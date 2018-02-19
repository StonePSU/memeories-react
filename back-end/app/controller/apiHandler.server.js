'use strict';

const path = require('path');
const Images = require(path.join(process.cwd(), 'app', 'models', 'image.js'));
const Users = require(path.join(process.cwd(), 'app', 'models', 'users.js'));
const uniqid = require('uniqid');

const apiHandler = {
  
  getImages: async function(req, res) {
    let query = Images.find({});
    try {
      let images = await query.exec();
      res.status(200).json({
        status: "Success", 
        message: "Success",
        count: images.length,
        data: images
      });
    } catch(error) {
      res.status(500).json({status: "Error", message: error});
    }
  },
  
  addImage: async function(req, res) {
    if (!req.auth) {
      res.sendStatus(401);
    }
    
    let userId = req.auth.id;
    let userQuery = Users.findById(userId);
    let userName = undefined;
    
    try {
      let user = await userQuery.exec();
      userName = user.twitter.username;
    } catch(error) {
      res.status(500).json({status: "Error", message: error})
    }
    
    let newImage = new Images();
    console.log(req.body);
    newImage.title = req.body.title;
    newImage.url = req.body.url;
    newImage.addedByUser = userName;
    
    try {
      let image = await newImage.save();
      res.status(200).json({status: "Success", message: "Image Successfully Saved", data: image});
    } catch(error) {
      res.status(500).json({status: "Error", message: error});
    }

  },
  
  deleteImage: async function(req, res) {
    if (!req.params.id) {
      return res.status(404).json({status: "Error", message: "Image not found"});
    }
    
    try {
      await Images.remove({id: req.params.id});
      res.status(200).json({status: "Success", message: "Image deleted"});
    } catch(error) {
      return res.status(500).json({status: "Error", message: error});
    }

  },
  
  toggleLike: async function(req, res) {
    let imageId = req.params.id;
    if (!imageId) {
      return res.status(404).json({status: "Missing Parameter", message: "Image ID must be provided"});
    }
    
    if (!req.body.user) {
      return res.status(404).json({status: "Missing Argument", message: "User iD must be provided"});
    }
    
    let query = Images.findOne({id: imageId});
    try {
      let results = await query.exec();

      if (results) {
        let likeUsers = results.likes || [];

        if (likeUsers.indexOf(req.body.user) >=0) {
          likeUsers.splice(likeUsers.indexOf(req.body.user), 1);
        } else {
          likeUsers.push(req.body.user);
        }
      } else {
        return res.status(410).json({status: "Error", message: "Image Not Found"});
      }
      
      try {
        await results.save();
        res.status(200).json({status: "Success", message: "Likes updated successfully", data: results});
      } catch (error2) {
        res.status(500).json({status: "Error", message: error2});
      }

    } catch(error) {
      console.log("error");
      res.status(500).json({status: "Error", message: error})
    }
    
  },
  
  getImagesForCurrentUser: async function(req, res) {
    
    if (!req.auth) {
      return res.sendStatus(401);
    }
    
    let userId = req.auth.id;
    let userQuery = Users.findById(userId);
    let userName = undefined;
    
    try {
      let user = await userQuery.exec();
      userName = user.twitter.username;
    } catch(error) {
      res.status(500).json({status: "Error", message: error})
    }

    let query = Images.find({addedByUser: userName});
    
    try {
      let images = await query.exec();
      res.status(200).json({status: "Success", message: "Success", count: images.length, data: images});
      
    } catch (error) {
      res.status(500).json({status: "Error", message: error}); 
    }
    
  },
  
  getUsers: async function(req, res) {
    let query = Users.find({});
    try {
      let users = await query.exec();
      res.status(200).json({status: "Success", message: "Success", count: users.length, data: users})
    } catch (error) {
      res.status(500).json({status: "Error", message: error});
    }
  },
  
  getUserInfo: async function(req, res) {
     if (!req.user) {
      return res.status(500).json({status: "Error", message: "Unable to identify user"});
     }
    
    res.status(200).json({
      status: "Success", 
      message: "Success", 
      data: {
        displayName: req.user.twitter.displayName
      }
    });
      
  },
  checkAuth: function(req, res) {
    if (req.isAuthenticated()) {
      res.status(200).json({ displayName: req.user.twitter.displayName});
    } else {
      
      res.sendStatus(401);
    }
  }
}

module.exports = apiHandler;