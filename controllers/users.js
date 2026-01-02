const user=require('../models/user.js');

module.exports.renderSignupForm=(req,res)=>{
    res.render('users/signup.ejs');
}

module.exports.signup=async(req,res,next)=>{
    try
    {
        let {username,email,password}=req.body;
        const newUser=new user({username,email});
        const registeredUser=await user.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{ //passport method to login user after signup
            if(err){
                return next(err);
            }
            req.flash('success','Welcome to WanderLust!');
            res.redirect('/listings');
        });
        
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    };
}


module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login.ejs');
}

module.exports.login=(async (req,res)=>{
        req.flash('success','Welcome back!');
        let redirectUrl = res.locals.redirectUrl || '/listings';
        // Avoid redirecting to destructive or method-overridden URLs
        if (redirectUrl && redirectUrl.includes('_method=')) {
            // Try to extract listing id and send user to the listing page
            const match = redirectUrl.match(/\/listings\/([^\/]+)/);
            redirectUrl = match ? `/listings/${match[1]}` : '/listings';
        }
        res.redirect(redirectUrl);
    }
);

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Logged out successfully!');
        res.redirect('/listings');
    });
}
