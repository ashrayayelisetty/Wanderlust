const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); 

module.exports.index = async (req,res)=>{
        let {search, category} = req.query;
        let filter = {};
        
        // Add search filter if search query exists
        if(search){
            filter.$or = [
                { country: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Add category filter if category query exists
        if(category){
            filter.category = category;
        }
        
        const listings = await Listing.find(filter);
        
        // console.log("Listings found:", listings.length);
        res.render("listings/index",{listings});
    
}

module.exports.newForm = (req,res)=>{
    res.render("listings/new");
}

module.exports.showListing = async (req,res)=>{
         const listing=await Listing.findById(req.params.id).populate({path:'reviews', populate: { path: 'author' }}).populate("owner");
        if(!listing){
            req.flash('error','Listing not found!');
           return res.redirect('/listings');
        }
        console.log(listing);
        res.render("listings/show",{listing});
    
}

module.exports.createListing = async (req,res,next)=>{

       let response= await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send()
       
        if(!req.file){
            req.flash('error','Please upload an image!');
            return res.redirect('/listings/new');
        }

        // Check if geocoding returned valid results
        if(!response.body.features || response.body.features.length === 0){
            req.flash('error','Location not found. Please enter a valid location!');
            return res.redirect('/listings/new');
        }

        let url=req.file.path;
        let fileName=req.file.filename;
        console.log("File uploaded to:", url);
        console.log("File name:", fileName);
        const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url:url, filename:fileName};
       newListing.geometry=response.body.features[0].geometry;
       console.log("Geocoded geometry:", newListing.geometry);
         await newListing.save();
         req.flash('success','Successfully made a new listing!');
        res.redirect(`/listings/`);
    
}

module.exports.editForm = async (req,res)=>{
    
        const listing=await Listing.findById(req.params.id);
        if(!listing){
        req.flash('error','Listing not found!');
           return res.redirect('/listings');
        }
        let originalUrl=listing.image.url;
        originalUrl = originalUrl.replace('/upload','/upload/w_250,h_250');
        res.render("listings/edit",{listing, originalUrl});
    
}

module.exports.updateListing = async (req,res)=>{
     let {id}=req.params;
     let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
     
     // If location changed, update geometry
     if(req.body.listing.location){
        let response= await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send()
        
        // Check if geocoding returned valid results
        if(!response.body.features || response.body.features.length === 0){
            req.flash('error','Location not found. Please enter a valid location!');
            return res.redirect(`/listings/${id}/edit`);
        }
        
        listing.geometry=response.body.features[0].geometry;
     }
     
     if( typeof req.file !== 'undefined'){
     let url=req.file.path;
     let fileName=req.file.filename;
     listing.image={url:url, filename:fileName};
     }
     await listing.save();
     req.flash('success','Successfully updated the listing!');
     res.redirect(`/listings`);
}

module.exports.deleteListing = async (req,res)=>{
    let {id}=req.params;
    let deletedList=await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedList);
    req.flash('success','Successfully deleted the listing!');
    res.redirect('/listings');
}