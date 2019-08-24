const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/auth');
const User = mongoose.model('User');

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

module.exports = router;
