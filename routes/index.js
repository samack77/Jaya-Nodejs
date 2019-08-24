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

let readOriginalFile = (nsort, mix = false) => {
  if(typeof nsort !== "function"){
    console.log("Please, You must to give a function to sort the arrays");
    return;
  }
  let narray = [];
  let i = 1;
  lineReader.eachLine('public/assets/original.txt', function(line, last) {
    let arr = JSON.parse(line.replace(";", ""));

    let sortedArr = arr.sort(nsort);
    if(mix && i % 2 === 0){
      sortedArr.reverse();
    }
    narray.push(sortedArr);
    i++;
    if(last){
      writeSortedFile(narray);
    }
  });
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
  readOriginalFile((a, b) => a-b, true);
  return res
    .status(200)
    .send({message: "OK"});
});

module.exports = router;
