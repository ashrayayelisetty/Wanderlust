const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});

const initDB=async()=>{
    try{
        await Listing.deleteMany({}); //clears any existing listings
        console.log("Cleared existing listings");   
        initData.data = initData.data.map((obj) => ({ ...obj, owner: '694ff6c621fd46067c599a2e' }));
        await Listing.insertMany(initData.data); 
        console.log("Inserted sample listings");
    }catch(err){
        console.log("Error initializing data:", err);
    } 
};

initDB();

//this script connects to the mongodb database and 
// populates it with sample listing data from data.js