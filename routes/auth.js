const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');
const tokenizer = require('../services/tokenizer');
const validator = require('../services/validator')

function check_required_fileds(body) {
    if (!'password' in body)
        return false;

    if (!'email' in body)
        return false;

    if (!validator.validateEmail(body.email))
        return false;

    return true;
}

router.post('/sign-up', function(req, res, next) {
	let user = new User({
        name: req.body.name,
    	email: req.body.email.toLowerCase()
    });

    user.setPassword(req.body.password);
    
    user.save(function(err){
        if (err)
            return res
                .status(400)
                .send({message : "Missing params"}); 
        else
            return res
    		    .status(200)
        	    .send({token: tokenizer.createToken(user)});
    });
});

router.post('/sign-in', function(req, res) {
    if (!check_required_fileds(req.body))
        return res
                .status(400)
                .send({message : "Missing params on validations"});

	User.findOne({email: req.body.email.toLowerCase()}, function(err, user) {
        if (!user)
            return res
                .status(400)
                .send({message : "User not found."});
        else{
            if (user.validPassword(req.body.password)) { 
                return res
                    .status(200)
                    .send({token: tokenizer.createToken(user), message : "User Logged In"});
            }else{ 
                return res
                    .status(400)
                    .send({message : "Wrong Password"}); 
            }
        }
    });
});

module.exports = router;