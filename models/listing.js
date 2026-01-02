const mongoose = require('mongoose');
const Review = require('./reviews');
const { string } = require('joi');
const Schema = mongoose.Schema;


//thsi schema is for the listings of the places to stay 
const ListingSchema = new Schema({
    title: {
        type: String,
        required: true  
    },
    description: {
        type: String,
        required: true
    },
    image:{
        url:String,
        filename:String,

        // type: String,

        // set:(v)=>v===""? "https://plus.unsplash.com/premium_photo-1668024966086-bd66ba04262f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2NlbmVyeXxlbnwwfHwwfHx8MA%3D%3D":v,
        // default:"https://plus.unsplash.com/premium_photo-1668024966086-bd66ba04262f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2NlbmVyeXxlbnwwfHwwfHx8MA%3D%3D",
        
    },
    price: {
        type: Number,   
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country:{
        type: String,
    },
    category: {
        type: String,
        enum: ['Trending', 'Top Rated', 'Rooms', 'Iconic Cities', 'Mountains', 'Pools', 'Castles', 'Forest', 'Skiing', 'Play'],
        default: 'Trending'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

//mongoose middleware to delete associated reviews when a listing is deleted
ListingSchema.post('findOneAndDelete', async(listing)=>{
    if(listing){
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

//this model is used to create and manage listings in the database
//here listing is the name of the model which will be used to interact with the listings collection in mongodb

const Listing = mongoose.model('Listing', ListingSchema);   
module.exports=Listing;