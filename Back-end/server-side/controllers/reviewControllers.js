const {reviewsModel,productsModel} = require('../models/Models')

exports.getReview = async(req,res,next)=>{
    const reviews = await reviewsModel.find({})
    res.json({
        reviews
    })
}


exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await productsModel.aggregate([
      {
        $project: {
          title: 1,
          _id: 0,
          comments: {
            $map: {
              input: "$comments",
              as: "commentBlock",
              in: {
                ProductId: "$$commentBlock.ProductId",
                User: {
                  $filter: {
                    input: "$$commentBlock.User",
                    as: "userComment",
                    cond: {
                      $and: [
                        { $ne: ["$$userComment.comment", null] },
                        { $ne: ["$$userComment.comment", ""] }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      },
      // Remove products where all comments[].User[] are empty arrays
      {
        $match: {
          comments: {
            $elemMatch: {
              "User.0": { $exists: true }
            }
          }
        }
      }
    ]);

    res.json({ reviews });
  } catch (error) {
    console.error("Error fetching filtered reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};






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