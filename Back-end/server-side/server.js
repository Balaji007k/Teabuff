const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const env = require('dotenv')
const path = require('path')
const users = require('./routes/users')
const reviews = require('./routes/reviews')
const products = require('./routes/products')
const categorys = require('./routes/categorys')
const carts = require('./routes/cart')
const shops = require('./routes/shops')
const CheckOut = require('./routes/CheckOut')
const cors = require('cors')
const {requireAuth} = require('./controllers/middleware/authMiddleware')
const { name } = require('nodeman/lib/mustache')
env.config({path: path.join(__dirname,'config.env')})

app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true // <-- allow cookies across domains
}));
app.use(cookieParser());


app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


app.get('/dashboard', requireAuth, (req, res) => {
  res.json({
    message: "Access granted",
    userId: req.user.id,
    userName: req.user.username
  });
});




app.use(users);
app.use(products);
app.use(categorys);
app.use(reviews);
app.use(shops);
app.use(carts);
app.use(CheckOut);



mongoose.connect(process.env.mongo_db)
.then(()=>{
    console.log('mongo_db connected')
})
.catch(()=>{
    console.log('mongo_db Not connected')
})



app.listen(process.env.PORT,()=>{
    console.log(`port running ${process.env.PORT}`)
})