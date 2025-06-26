const {productsModel} = require('../models/Models')



exports.getProduct = async(req,res)=>{
    const products = await productsModel.find({})
    res.json({
        products
    })
}



exports.getSingleProduct = async(req,res)=>{
    try{
    const product = await productsModel.findById(req.params.id)
    res.json({
        product
    })
}
catch{
    res.status(404).json({ message: "Product not found", error: error.message });
}
}

exports.getProductReviews = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const Comments = product.comments[0];

    // Calculate average rating
    const ratings = Comments?.User.map(r => r.ProductUserRating).filter(r => typeof r === 'number');


    const avgRating =
      ratings?.length > 0
        ? (ratings.reduce((acc, val) => acc + val, 0) / ratings.length).toFixed(1)
        : 0;
    product.rating = avgRating;

    await product.save();

    res.json({
      avgRating,
      Comments
    });
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      description,
      url,
      categoryId,
      rating,
      ingredients,
      features,
      purchaseLink
    } = req.body;

    const newItem = {
      title,
      price,
      description,
      url,
      categoryId,
      rating,
      ingredients,
      features,
      purchaseLink
    };

    const product = await productsModel.create(newItem);
    res.json({ message:'Sccessfully Created',product });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Duplicate productId" });
    } else {
      res.status(500).json({ message: "Item creation failed", error: error.message });
    }
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const SelectedProduct = await productsModel.findById(id);

    if (!SelectedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      title,
      price,
      description,
      url,
      categoryId,
      rating,
      ingredients,
      features,
      purchaseLink,
      UserId,
      userImage,
      username,
      ProductUserRating,
      comment
    } = req.body;

    // Update product fields
    if (title) SelectedProduct.title = title;
    if (price) SelectedProduct.price = price;
    if (description) SelectedProduct.description = description;
    if (url) SelectedProduct.url = url;
    if (categoryId) SelectedProduct.categoryId = categoryId;
    if (rating) SelectedProduct.rating = rating;
    if (ingredients) SelectedProduct.ingredients = ingredients;
    if (features) SelectedProduct.features = features;
    if (purchaseLink) SelectedProduct.purchaseLink = purchaseLink;

    // Add or update comment only if comment-related fields are present
    // Add or update comment only if comment-related fields are present
if (UserId && userImage && username && comment) {
  const userComment = {
    UserId,
    userImage,
    username,
    ProductUserRating,
    comment
  };

  let commentBlock = SelectedProduct.comments?.find(c => c.ProductId === id);

  if (!commentBlock) {
    SelectedProduct.comments.push({
      ProductId: id,
      User: [userComment]
    });
  } else {
    const existingUser = commentBlock.User.find(u => u.UserId === UserId);
    if (existingUser) {
      existingUser.ProductUserRating = ProductUserRating;
      existingUser.comment = comment;
    } else {
      commentBlock.User.push(userComment);
    }
  }
}

    // Re-fetch updated commentBlock
    commentBlock = SelectedProduct.comments.find(c => c.ProductId === id);

    // Calculate average rating
    const ratings = commentBlock?.User.map(r => r.ProductUserRating).filter(r => typeof r === 'number');

    const avgRating = ratings?.length > 0? (ratings.reduce((acc, val) => acc + val, 0) / ratings.length).toFixed(1): 0;

    SelectedProduct.rating=avgRating;

    const updatedProduct = await SelectedProduct.save();

    res.json({
      message: "Successfully updated product",
      avgRating,
      updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Update not completed",
      error: error.message
    });
  }
};







exports.deleteSingleProduct = async(req,res)=>{
    try{
    await productsModel.findByIdAndDelete(req.params.id)
    res.json({
        message:"deleted"
    })
    }
    catch{
    res.json({
        message:"Not deleted"
    })
    }
}