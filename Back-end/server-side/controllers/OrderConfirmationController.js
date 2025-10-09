const mongoose = require("mongoose");
const { OrderConfirmationModel, usersModel } = require('../models/Models');
const { sendOrderConfirmation } = require("../utils/sendEmail");

exports.createOrderConfirmation = async (req, res) => {
  try {
    const { userId, newOrder } = req.body;

    const exists = await OrderConfirmationModel.findOne({
  userId: new mongoose.Types.ObjectId(userId),
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

    if (newOrder.email) {
  const subject = `Order Confirmation - ${newOrder.orderId}`;

  // Build detailed product list
  const productsList = newOrder.products
    .map(
      (p, i) =>
        `${i + 1}. ${p.name}\n   Quantity: ${p.qty}\n   Price: ₹${p.price}\n   Image: ${p.image}`
    )
    .join("\n\n");

  const text = `
Hi ${newOrder.customerName},

Your order (${newOrder.orderId}) has been successfully placed! Here are the full details:

Order Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
Delivery Date: ${
  newOrder.deliveryDate
    ? new Date(newOrder.deliveryDate).toLocaleDateString("en-IN", { 
        day: "2-digit", month: "short", year: "numeric", 
        hour: "2-digit", minute: "2-digit" 
      })
    : "N/A"
}

Shipping Address: ${newOrder.address}
Contact: ${newOrder.contact}

Products:
${productsList}

Subtotal: ₹${newOrder.subtotal}
Shipping: ₹${newOrder.shipping}
Tax: ₹${newOrder.tax}
Total: ₹${newOrder.total}

Payment Type: ${newOrder.paymentType}
${newOrder.cardEnding ? `Card Ending: ${newOrder.cardEnding}` : ""}

Thank you for shopping with Teabuff!

Regards,
Teabuff Store
`;

if (newOrder.email) {
  try {
    await sendOrderConfirmation(newOrder.email, subject, text);
  } catch (emailErr) {
    console.error("Failed to send email:", emailErr);
  }
}
}

  if (newOrder?.address) {
  await usersModel.findByIdAndUpdate(userId, { address: newOrder.address });
}


    res.status(201).json({ message: "Order created and email sent", newOrder: newOrder.orderId });
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

exports.getAllorders = async(req,res) => {
  try {
    const Orders = await OrderConfirmationModel.find();
    if(Orders) {res.status(200).json({message:"Successfully fetched",Orders:Orders});}
    else{res.status(404).json({message:"No Orders found"})}
  } catch (error) {
    res.status(500).json({error:error.message});
  }
}

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


