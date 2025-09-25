const mongoose = require("mongoose");
const { OrderConfirmationModel } = require('../models/Models');
const { sendOrderConfirmation } = require("../utils/sendEmail");

// CREATE ORDER (push into same userId's array)
// exports.createOrderConfirmation = async (req, res) => {
//   try {
//     const { userId, newOrder } = req.body;

//     const exists = await OrderConfirmationModel.findOne({
//   "OrderDetails.orderId": newOrder.orderId
// });
// if (exists) {
//   return res.status(400).json({ error: "OrderId already exists" });
// }


//     const order = await OrderConfirmationModel.findOneAndUpdate(
//   { userId: new mongoose.Types.ObjectId(userId) },
//   { $push: { OrderDetails: newOrder } },
//   { new: true, upsert: true }
// );

//     res.status(201).json({ message: "Order created", newOrder:newOrder.orderId });
//   } catch (err) {
//     console.error("Error creating order:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// const twilio = require("twilio");
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const fromNumber = process.env.TWILIO_PHONE_NUMBER; 
// const client = twilio(accountSid, authToken);

// exports.createOrderConfirmation = async (req, res) => {
//   try {
//     const { userId, newOrder } = req.body;

//     // Check if order exists
//     const exists = await OrderConfirmationModel.findOne({
//       "OrderDetails.orderId": newOrder.orderId
//     });
//     if (exists) {
//       return res.status(400).json({ error: "OrderId already exists" });
//     }

//     // Save order
//     const order = await OrderConfirmationModel.findOneAndUpdate(
//       { userId: new mongoose.Types.ObjectId(userId) },
//       { $push: { OrderDetails: newOrder } },
//       { new: true, upsert: true }
//     );

//     // Send SMS if contact exists
//     if (newOrder.contact) {
//       await client.messages.create({
//         body: `Hi ${newOrder.customerName}, your order (${newOrder.orderId}) has been successfully placed! Total: ₹${newOrder.total}.`,
//         from: fromNumber,
//         to: newOrder.contact, // e.g. +91XXXXXXXXXX
//       });
//     }

//     res.status(201).json({ message: "Order created and SMS sent", newOrder: newOrder.orderId });
//   } catch (err) {
//     console.error("Error creating order:", err);
//     res.status(500).json({ error: err.message });
//   }
// };



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

    // Send confirmation email
    // if (newOrder.email) {
    //   const subject = `Order Confirmation - ${newOrder.orderId}`;
    //   const text = `Hi ${newOrder.customerName},\n\nYour order (${newOrder.orderId}) has been successfully placed!\n\nTotal: ₹${newOrder.total}\n\nThank you for shopping with Teabuff.`;
    //   await sendOrderConfirmation(newOrder.email, subject, text);
    // }

    if (newOrder.email) {
  const subject = `Order Confirmation - ${newOrder.orderId}`;

  // Build detailed product list
  const productsList = newOrder.products
    .map(
      (p, i) =>
        `${i + 1}. ${p.name}\n   Quantity: ${p.qty}\n   Price: ₹${p.price}\n   CategoryId: ${p.categoryId}\n   Image: ${p.image}`
    )
    .join("\n\n");

  const text = `
Hi ${newOrder.customerName},

Your order (${newOrder.orderId}) has been successfully placed! Here are the full details:

Delivery Date: ${newOrder.deliveryDate}
Shipping Address: ${newOrder.address}
Contact: ${newOrder.contact}

Products:
${productsList}

Subtotal: ₹${newOrder.subtotal}
Shipping: ₹${newOrder.shipping}
Tax: ₹${newOrder.tax}
Total: ₹${newOrder.total}

Payment Type: ${newOrder.paymentType}
Card Ending: ${newOrder.cardEnding}

Contact : ${newOrder.contact}

Thank you for shopping with Teabuff!

Regards,
Teabuff Store
`;

  await sendOrderConfirmation(newOrder.email, subject, text);
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


