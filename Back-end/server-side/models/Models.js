const mongoose = require('mongoose');

// Define the schema for each user
const userSchema = new mongoose.Schema({
  profileImage: {
    type: String,   // store image URL / file path
    required: false // optional field
  },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  address: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const usersModel = mongoose.model('users', userSchema);

// Define the schema for each cartItem
const CartSchema = new mongoose.Schema({
  productId:{type:String, required:true},
  itemPrice:{type:Number, required:true},
  quantity: { type: Number, required: true },
  itemName: { type: String, required: true },
  categoryId: { type: Number, required: true },
  Product_Url: {type:String,required:true},
  Rating: { type: Number, required: true },
  Description: {type:String,required:true},
  likes: { type: Number, default:false},
});


// Define the schema for each usercart
const userCartSchema = new mongoose.Schema({
  userId: { type: String, required: true , unique:true},
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
      content: { type: String, required: true },
      createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const shopModel = mongoose.model('shop', shopSchema);

// Create the model for the category
const categorySchema = new mongoose.Schema({
      categoryId: { type: Number, required: true, unique:true},
      name: { type: String, required: true },
      offer: {type: Number,default:0}
});

// Create a model from the schema
const categoryModel = mongoose.model('category', categorySchema);

// // Create the model for the offers
// const offerSchema = new mongoose.Schema({
//       categoryId: { type: Number, required: true, unique:true},
//       name: { type: String, required: true },
//       offer: {type: Number,default:0}
// });

// // Create a model from the schema
// const offerModel = mongoose.model('offer', offerSchema);

const ProductReviewsSchema = mongoose.Schema({
  UserId:{type:String,required:true},
  userImage:{type:String,required:false},
  username:{type:String,required:true},
  ProductUserRating:{type:Number,default:0},
  comment:{type:String,default:null},
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments:[commentsSchemaa],
});


// Create a model from the schema
const productsModel = mongoose.model('products', prouctSchema);

const ProductStockSchema = mongoose.Schema({
  ProductId:{type:String,required:true},
  productName:{type:String},
  Stock:{type:Number,required:true,default:0, min:0},
  updatedOrders: [{ orderId: String }],
  createdAt:{type:Date,default:Date.now}
})

// Define the schema for each product stock
const productStockModel = mongoose.model('productStock',ProductStockSchema)

// Define the schema for each UserLikedState
const UserLikedState = new mongoose.Schema({
  ProductId:{type:String,required:true},
  // title: { type: String, required: true },
  // price: { type: Number, required: true },
  // description: { type: String, required: true },
  // url: { type: String, required: true },
  // categoryId: { type: Number, required: true },
  // rating: { type: String, default:0, required: true },
  // ingredients: { type: String, required: true },
  // features: { type: String, required: true },
  // purchaseLink: { type: String, required: true },
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
  phone: { type: Number, required:true },
  ReUseData: {type:Boolean,default:false},
  FeedOffers: {type:Boolean,default:false}
});

const CheckOutData = new mongoose.Schema({
  UserId:{type:String,required:true},
  contactEmail:{type:String,required:true},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ShippingDetails:[ShippingDetail]
})

// Create a model from the schema
const CheckOutModel = mongoose.model('CheckOutData', CheckOutData);

const OrderSchemaDetails = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  // Array of products
  products: [
    {
      productId:{type:String,required:true},
      categoryId: { type: Number, required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],

  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },

  paymentType: { type: String, required: true }, // e.g. "Visa", "Mastercard"
  cardEnding: { type: String, required: true }, // last 4 digits

  contact:{type:Number,required:true},

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  OrderDetails: [OrderSchemaDetails],
});

const OrderConfirmationModel = mongoose.model("Order", OrderSchema);

module.exports = {usersModel, userCartModel, reviewsModel, categoryModel, productsModel, productStockModel, shopModel, UserStateModel, CheckOutModel, OrderConfirmationModel };
