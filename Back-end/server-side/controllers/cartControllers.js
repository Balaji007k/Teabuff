const {userCartModel} = require('../models/Models')
const lodash = require('lodash');

exports.getCartItem = async(req,res,next)=>{
    const id = req.params.id
    const carts = await userCartModel.find({})
    const userIdcart = carts.find(Id => Id.userId === id)
    res.json({
        userIdcart
    })
}


exports.createCartItem = async(req,res,next)=>{
        let {userId,productId,itemPrice,quantity,itemName,Product_Url,Rating,Description,likes} = req.body

        if(!quantity || quantity<=0){
            quantity=1;
        }
    
    try {
     const usercart = await userCartModel.findOne({userId})
     if(!usercart) {
        const NewCart = {
            userId,
            items:[{productId,itemPrice,quantity,itemName,Product_Url,Rating,Description,likes}]
        }
        await userCartModel.create(NewCart)
     }
     else{
        const itemIndex = usercart.items.findIndex(item => item.productId === productId)
        if(itemIndex!==-1){
        usercart.items[itemIndex].quantity = quantity;
        usercart.items[itemIndex].likes = likes;
        }
        else{
            usercart.items.push({productId,itemPrice,quantity,itemName,Product_Url,Rating,Description,likes})
        }
     }
     await usercart.save();
    res.json({
        usercart
    })
    } catch (error) {
        res.json({
            message:"not created"
        })
    }
    
}


exports.updateCartItems = async (req, res) => {
    const userId = req.params.userId;
    const { items } = req.body;

    if (!userId || !Array.isArray(items)) {
        return res.status(400).json({ message: "userId and items are required." });
    }

    try {
        const existingCart = await userCartModel.findOne({ userId });

        if (!existingCart) {
            // Handle new cart creation with default quantity = 1 if missing
            const cleanedItems = items.map(item => ({
                ...item,
                quantity: item.quantity != null ? item.quantity : 1
            }));

            const newCart = new userCartModel({ userId, items: cleanedItems });
            await newCart.save();
            return res.status(201).json({ message: "Cart created successfully" });
        }

        const existingItems = existingCart.items;

        // Create a map for quick lookup
        const existingMap = new Map();
        existingItems.forEach(item => {
            existingMap.set(item.productId, item);
        });

        items.forEach(incomingItem => {
            const existingItem = existingMap.get(incomingItem.productId);

            if (existingItem) {
                // If incoming quantity is defined, update it; otherwise, keep existing
                if (incomingItem.quantity != null) {
                    existingItem.quantity = incomingItem.quantity;
                }
            } else {
                // New item → set quantity to 1 if not provided
                const newItem = {
                    ...incomingItem,
                    quantity: incomingItem.quantity != null ? incomingItem.quantity : 1
                };
                existingItems.push(newItem);
            }
        });

        const UpdatedCart = await existingCart.save();

        res.status(200).json({ message: "Cart updated successfully",UpdatedCart });

    } catch (err) {
        console.error("Error updating cart:", err);
        res.status(500).json({ message: "Error updating cart" });
    }
};





exports.deleteCartItem = async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;

    try {
        const cart = await userCartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.productId !== productId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        await cart.save();
        res.status(200).json({ 
            cart,
            message: "Item removed from cart successfully" });

    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: "Error removing item from cart" });
    }
};





