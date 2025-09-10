const mongoose = require("mongoose");
const { OrderConfirmationModel } = require('../models/Models')

// CREATE ORDER (push into same userId's array)
exports.createOrderConfirmation = async (req, res) => {
  try {
    const { userId, newOrder } = req.body;

    const exists = await OrderConfirmationModel.findOne({
  "OrderDetails.orderId": newOrder.orderId
});
if (exists) {
  return res.status(400).json({ error: "OrderId already exists" });
}


    const order = await OrderConfirmationModel.findOneAndUpdate(
  { userId: new mongoose.Types.ObjectId(userId) },
  { $push: { OrderDetails: newOrder } },
  { new: true, upsert: true }
);

    res.status(201).json({ message: "Order created", newOrder:newOrder.orderId });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET ORDER (find specific order by orderId and userId)
exports.getOrderConfirmation = async (req, res) => {
  try {
    const { userId, orderId } = req.params; // assuming both come in params

    const order = await OrderConfirmationModel.findOne(
      { 
        userId: new mongoose.Types.ObjectId(userId), 
        "OrderDetails.orderId": orderId 
      },
      { "OrderDetails.$": 1 } // return only the matched order inside array
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found for this user" });
    }

    res.json(order.OrderDetails[0]); // return just the matched order object
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const userOrders = await OrderConfirmationModel.findOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      { OrderDetails: 1, _id: 0 } // only return OrderDetails array
    );

    if (!userOrders || userOrders.OrderDetails.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.json(userOrders.OrderDetails); // return all orders for this user
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE all orders for a user
exports.deleteUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete the whole document for this user
    const deleted = await OrderConfirmationModel.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!deleted) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.json({ message: `All orders for user ${userId} have been deleted.` });
  } catch (err) {
    console.error("Error deleting user orders:", err);
    res.status(500).json({ error: err.message });
  }
};


