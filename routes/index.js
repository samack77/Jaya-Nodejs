const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/auth');
const logMiddleware = require('../middlewares/sort_log');
const User = mongoose.model('User');
const lineReader = require('line-reader');
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.status(200).send({ message: 'Express' });
});

router.get('/me', authMiddleware.ensureAuthenticated, function(req, res, next) {
  User.findOne({_id: mongoose.Types.ObjectId(req.user)}, function (err, user) {
		if (err){
      console.log(err);
      return res
				.status(500)
				.send({message: "Oops, Something is wrong!"});
    }else
			if (user)
				return res
					.status(200)
					.send({id: user._id, email: user.email, name: user.name, is_admin: user.is_admin, message: "User found"});
			else
				return res
					.status(404)
					.send({message: "User not found"});
	});  
});

let writeSortedFile = (arr) => {
  let stream = fs.createWriteStream("public/assets/sorted.txt");
  stream.once('open', function(fd) {
    arr.forEach((item) => {
      stream.write(`${JSON.stringify(item)};\n`);
    });    
    stream.end();
  });
} 

let readOriginalFile = (nsort) => {
  if(typeof nsort !== "function"){
    console.log("Please, You must to give a function to sort the arrays");
    return;
  }
  let narray = [];
  lineReader.eachLine('public/assets/original.txt', function(line, last) {
    let arr = JSON.parse(line.replace(";", ""));
    const sortedArr = arr.sort(nsort);
    narray.push(sortedArr);
    if(last){
      writeSortedFile(narray);
    }
  });  
}

let desc = (a, b) => {
  if(b < a){
    return -1;
  }
  if(b > a){
    return 1;
  }
  return 0;
}

router.get('/asc', logMiddleware.storeLog, function(req, res, next){
  readOriginalFile((a, b) => a-b);
  return res
    .status(200)
    .send({message: "OK"});
});

router.get('/des', logMiddleware.storeLog, function(req, res, next){
  readOriginalFile((a, b) => b-a);
  return res
    .status(200)
    .send({message: "OK"});
});

router.get('/mix', logMiddleware.storeLog, function(req, res, next){
  return res
    .status(200)
    .send({message: "OK"});
});

module.exports = router;
