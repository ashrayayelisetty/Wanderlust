const express=require('express');
const router=express.Router();
const passport=require('passport');
const user=require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const {saveredirectUrl}=require('../middleware.js');
const usersController=require('../controllers/users.js');


router.route("/signup")
    .get(usersController.renderSignupForm)
    .post(wrapAsync(usersController.signup));


router.route("/login")
    .get(usersController.renderLoginForm)
    .post(
    saveredirectUrl,
    passport.authenticate('local',{
        failureFlash:true,
        failureRedirect:'/login'
    }),
   usersController.login
);
    
router.get('/logout',usersController.logout);

// Signup route
// router.post('/signup',wrapAsync(usersController.signup));
    
// Login routes
// router.get('/login',usersController.renderLoginForm);

// // Login route
// router.post('/login',
//     saveredirectUrl,
//     passport.authenticate('local',{
//         failureFlash:true,
//         failureRedirect:'/login'
//     }),
//    usersController.login
// );




module.exports=router;