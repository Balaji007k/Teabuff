const {CheckOutModel} = require('../models/Models')



exports.CheckOutList = async(req,res)=>{
    try {
        const CheckOutDatas = await CheckOutModel.find({})
    res.json({
        CheckOutDatas
    })
    } catch (error) {
    res.status(404).json({ message: "CheckOutDatas not found", error: error.message });
    }
}



exports.getSingleCheckOut = async(req,res)=>{
    try{
    const UserCheckOut = await CheckOutModel.findOne({UserId:req.params.id})
    res.json({
        UserCheckOut
    })
}
catch{
    res.status(404).json({ message: "UserCheckOut not found", error: error.message });
}
}

exports.createNewCheckOut = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      contactEmail,
      firstname,
      lastname,
      company,
      address,
      apartment,
      city,
      postcode,
      phone,
      CheckoutReUse
    } = req.body;

    const NewCheckOut = {
      firstname,
      lastname,
      company,
      address,
      apartment,
      city,
      postcode,
      phone,
      ReUseData:CheckoutReUse
    };

    const NewCheckout = await CheckOutModel.findOne({UserId:id})

    if(!NewCheckout){
    await CheckOutModel.create({
      UserId:id,
      contactEmail:contactEmail,
      ShippingDetails:[NewCheckOut]
    });
}else{
        NewCheckout.contactEmail=contactEmail;
        NewCheckout.ShippingDetails[0]=NewCheckOut;
        await NewCheckout.save();
}

    res.json({message:"successfully Created"})

  } catch (error) {

    console.error("Error creating product:", error)
  }
};



// exports.updateProduct = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const SelectedProduct = await CheckOutModel.findById(id);

//     if (!SelectedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const {
//       title,
//       price,
//       description,
//       url,
//       categoryId,
//       rating,
//       ingredients,
//       features,
//       purchaseLink,
//       UserId,
//       userImage,
//       username,
//       ProductUserRating,
//       comment
//     } = req.body;

//     // Update product fields
//     if (title) SelectedProduct.title = title;
//     if (price) SelectedProduct.price = price;
//     if (description) SelectedProduct.description = description;
//     if (url) SelectedProduct.url = url;
//     if (categoryId) SelectedProduct.categoryId = categoryId;
//     if (rating) SelectedProduct.rating = rating;
//     if (ingredients) SelectedProduct.ingredients = ingredients;
//     if (features) SelectedProduct.features = features;
//     if (purchaseLink) SelectedProduct.purchaseLink = purchaseLink;

//     // Add or update comment only if comment-related fields are present
//     // Add or update comment only if comment-related fields are present
// if (UserId && userImage && username && comment) {
//   const userComment = {
//     UserId,
//     userImage,
//     username,
//     ProductUserRating,
//     comment
//   };

//   let commentBlock = SelectedProduct.comments?.find(c => c.ProductId === id);

//   if (!commentBlock) {
//     SelectedProduct.comments.push({
//       ProductId: id,
//       User: [userComment]
//     });
//   } else {
//     const existingUser = commentBlock.User.find(u => u.UserId === UserId);
//     if (existingUser) {
//       existingUser.ProductUserRating = ProductUserRating;
//       existingUser.comment = comment;
//     } else {
//       commentBlock.User.push(userComment);
//     }
//   }
// }

//     // Re-fetch updated commentBlock
//     commentBlock = SelectedProduct.comments.find(c => c.ProductId === id);

//     // Calculate average rating
//     const ratings = commentBlock?.User.map(r => r.ProductUserRating).filter(r => typeof r === 'number');

//     const avgRating = ratings?.length > 0? (ratings.reduce((acc, val) => acc + val, 0) / ratings.length).toFixed(1): 0;

//     SelectedProduct.rating=avgRating;

//     const updatedProduct = await SelectedProduct.save();

//     res.json({
//       message: "Successfully updated product",
//       avgRating,
//       updatedProduct
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({
//       message: "Update not completed",
//       error: error.message
//     });
//   }
// };
