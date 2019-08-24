const jwt = require('jwt-simple');
const env = require('../config/env');
const moment = require('moment');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.ensureAuthenticated = function(req, res, next) {
  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({message: "Tu petición no tiene cabecera de autorización"});
  }
  
  let token = req.headers.authorization.split(" ")[1];
  let payload;
  try{
    payload = jwt.decode(token, env.TOKEN_SECRET);
  }catch(exception){
    return res
       .status(401)
        .send({message: "Invalid token"});
  }
  
  if(payload.exp <= moment().unix()) {
     return res
     	.status(401)
        .send({message: "Token has expired"});
  }

  User.findOne({_id: mongoose.Types.ObjectId(payload.sub)}, function (err, user) {
    if (err || !user) {
      return res
       .status(401)
        .send({message: "User not found"});
    }

    req.user = payload.sub;
    next();
  })
}