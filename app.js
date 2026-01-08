if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const express=require('express');
const app=express();        
const port=8080;
const methodOverride=require('method-override'); //to use put and delete methods in forms
app.use(methodOverride('_method'));
const ejsMate=require('ejs-mate'); //to use ejs layouts
app.engine('ejs',ejsMate);
const session=require('express-session'); //to use sessions
const MongoStore = require('connect-mongo').default;
const flash=require('connect-flash'); //to use flash messages
const passport=require('passport'); //to use passport for authentication
const LocalStrategy=require('passport-local'); //to use local strategy for passport
const user=require('./models/user.js'); //user model


// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const {listingScehma,reviewSchema}=require("./schema.js");

const path=require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));

const mongoose=require('mongoose');
const dbUrl=process.env.ATLASDB_URL;
const { error } = require('console');


//routers 
const listingsRouter=require('./routes/listings.js');
const reviewsRouter=require('./routes/reviews.js');
const usersRouter=require('./routes/user.js');
const {saveredirectUrl}=require('./middleware.js');

async function main(){
    await mongoose.connect(dbUrl);
}

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*60*60 //time period in seconds

});

store.on("error",function(e){
    console.log("Session store error",e);
});


const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false, //don't save session if unmodified
    saveUninitialized:true, //don't create session until something stored
    cookie:{
        expires: Date.now() + 1000*60*60*24*7, //1 week in milliseconds
        maxAge: 1000*60*60*24*7, //1 week in milliseconds
        httpOnly:true, //cookie not accessible via client-side scripts,prevents cross-site scripting attacks

    },
};
app.use(session(sessionOptions)); //session middleware
app.use(flash()); //flash middleware


app.use(passport.initialize());
app.use(passport.session()); //to use persistent login sessions
passport.use(new LocalStrategy(user.authenticate())); //using authenticate method of user model to authenticate users

passport.serializeUser(user.serializeUser());//to store user in session
passport.deserializeUser(user.deserializeUser());//to remove user from session

//middleware to pass flash messages and current user to all templates
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
});

//redirect base URL to listings index
app.get('/', (req, res) => {
    res.redirect('/listings');
});

//using listings router for all routes starting with /listings
app.use('/listings',listingsRouter);
app.use('/listings/:id/reviews',reviewsRouter);//reviews routes
app.use('/',usersRouter);//users routes


//error handling middleware
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    res.status(status).render("error.ejs",{err})
    // res.status(status).send(message);
});

    
//starting the server
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});