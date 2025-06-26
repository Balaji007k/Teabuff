const mongoose = require('mongoose');

// Define the schema for each user
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true }
});

// Create a model from the schema
const usersModel = mongoose.model('users', userSchema);

// Define the schema for each cartItem
const CartSchema = new mongoose.Schema({
  productId:{type:String, required:true},
  itemPrice:{type:Number, required:true},
  quantity: { type: Number, required: true },
  itemName: { type: String, required: true },
  Product_Url: {type:String,required:true},
  Rating: { type: Number, required: true },
  Description: {type:String,required:true},
  likes: { type: Number, default:false},
});


// Define the schema for each usercart
const userCartSchema = new mongoose.Schema({
  userId: { type: String, required: true , unique:true},
  items: [CartSchema]
});


// Create a model from the schema
const userCartModel = mongoose.model('carts', userCartSchema);

// Define the schema for each review
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  review: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true }
});


// Create a model from the schema
const reviewsModel = mongoose.model('reviews', reviewSchema);

// Create the model for the shop
const shopSchema = new mongoose.Schema({
      url: { type: String, required: true },
      content: { type: String, required: true }
});

// Create a model from the schema
const shopModel = mongoose.model('shop', shopSchema);

// Create the model for the category
const categorySchema = new mongoose.Schema({
      categoryId: { type: Number, required: true, unique:true},
      name: { type: String, required: true },
});

// Create a model from the schema
const categoryModel = mongoose.model('category', categorySchema);

const ProductReviewsSchema = mongoose.Schema({
  UserId:{type:String,required:true,unique:true},
  userImage:{type:String,required:true},
  username:{type:String,required:true},
  ProductUserRating:{type:Number,default:0},
  comment:{type:String,default:null}
})

const commentsSchemaa = mongoose.Schema({
  ProductId:{type:String,required:true},
  User:[ProductReviewsSchema]
})

// Define the schema for each product
const prouctSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  categoryId: { type: Number, required: true },
  rating: { type: String, default:0, required: true },
  ingredients: { type: String, required: true },
  features: { type: String, required: true },
  purchaseLink: { type: String, required: true },
  likes:{type:Number , default:false},
  comments:[commentsSchemaa],
});


// Create a model from the schema
const productsModel = mongoose.model('products', prouctSchema);

// Define the schema for each review
const UserLikedState = new mongoose.Schema({
  ProductId:{type:String,required:true},
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  categoryId: { type: Number, required: true },
  rating: { type: String, default:0, required: true },
  ingredients: { type: String, required: true },
  features: { type: String, required: true },
  purchaseLink: { type: String, required: true },
  likedState:{type:Boolean, default:false,required:true},
});

const UserReviews = new mongoose.Schema({
  UserId:{type:String,required:true,unique:true},
  UserState:[UserLikedState],
})


// Create a model from the schema
const UserStateModel = mongoose.model('UserState', UserReviews);

// Define the schema for Shipping
const ShippingDetail = new mongoose.Schema({
  firstname:{type:String,required:true},
  lastname: { type: String },
  company: { type: String },
  address: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  postcode: { type: Number, required: true },
  phone: { type: Number },
  ReUseData: {type:Boolean,default:false},
  FeedOffers: {type:Boolean,default:false}
});

const CheckOutData = new mongoose.Schema({
  UserId:{type:String,required:true},
  contactEmail:{type:String,required:true},
  ShippingDetails:[ShippingDetail]
})

// Create a model from the schema
const CheckOutModel = mongoose.model('CheckOutData', CheckOutData);

module.exports = {usersModel, userCartModel, reviewsModel, categoryModel, productsModel, shopModel, UserStateModel, CheckOutModel };
