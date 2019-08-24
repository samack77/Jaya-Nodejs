# Basic-Token-Auth
NodeJS project to authenticate users by token, using jwt, Mongoose, crypto, Express; 

# Endpoints

**/auth/sign-up** => Public, endpoint to register one user

**/auth/sign-in** => Public, endpoint to login into the APP

**/me** => Private, to get info by current user, you need a token

**/** => Public endpoint to test API

# How to test private endpoint

To test this, you'll need a token you get on Sing up or Sing in methods. You might do like this:

> content-type: application/x-www-form-urlencoded
Authorization: Bearer yourLongTokenHere

**This app run on port 3000**

# How to run app

> TOKEN_SECRET=your_token_here npm start
