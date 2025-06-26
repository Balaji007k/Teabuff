const {reviewsModel} = require('../models/Models')

exports.getReview = async(req,res,next)=>{
    const reviews = await reviewsModel.find({})
    res.json({
        reviews
    })
}


exports.createReview = async(req,res,next)=>{
    try {
        const {name,review,image,rating} = req.body
    const reviews = {
        name,review,image,rating
    }
    const userReview = await reviewsModel.create(reviews)
    userReview.save()
    res.json({
        userReview
    })
    } catch (error) {
        res.json({
            message:"not created"
        })
    }
    
}