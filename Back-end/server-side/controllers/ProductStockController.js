const {productStockModel,productsModel} = require('../models/Models')

exports.getAllProductStock = async(req,res)=>{
    try{
    const productStocks = await productStockModel.find({});
    res.json({
        productStocks
    })
}
    catch(error){
    res.status(404).json({ message: "Product not found", error: error.message });
}
}

exports.getSingleProductStock = async(req,res)=>{
    try{
    const productStock = await productStockModel.findOne({ProductId:req.params.id});
    res.json({
        productStock
    })
}
    catch(error){
    res.status(404).json({ message: "Product not found", error: error.message });
}
}

exports.createSingleProductStock = async(req,res)=>{
    try {
        const {ProductId,productName,Stock} = req.body
    const ProductStock = {
        ProductId,productName,Stock
    }
    const productStock = await productStockModel.create(ProductStock)
    res.status(200).json({
        productStock
    })
    } catch (error) {
        res.status(500).json({
            message:"not created"
        })
    }
    
}

exports.createMultipleProductsStock = async (req, res) => {
  try {
    // 1️ Fetch all products (only _id and title)
    const products = await productsModel.find({}, { _id: 1, title: 1 });

    // 2️ Generate random stock data for each product
    const stockData = products.map(p => ({
      ProductId: p._id,
      productName: p.title,
      Stock: Math.floor(Math.random() * 91) + 10 // random between 10–100
    }));

    // 3️ Insert all stock data into the collection
    const productStocks = await productStockModel.insertMany(stockData);

    // 4️ Respond with success
    return res.status(201).json({
      message: "Stock created for all products successfully",
      count: productStocks.length,
      productStocks
    });

  } catch (error) {
    console.error("Error creating product stocks:", error);
    res.status(500).json({
      message: "Error creating product stock(s)",
      error: error.message
    });
  }
};

exports.updateProductStock = async (req, res) => {
  try {
    const body = req.body;

    // Case 1: Multiple updates (array of { ProductId, Stock })
    if (Array.isArray(body)) {
      // Validate
      if (body.length === 0)
        return res.status(400).json({ message: "No product data provided" });

      // Perform bulk updates using Promise.all
      const updatePromises = body.map(async ({ ProductId, Stock }) => {
        if (!ProductId || Stock === undefined) return null;
        return await productStockModel.findOneAndUpdate(
          { ProductId },
          { $set: { Stock } },
          { new: true }
        );
      });

      const updatedStocks = await Promise.all(updatePromises);
      const filtered = updatedStocks.filter(s => s !== null);

      return res.status(200).json({
        message: "Multiple product stocks updated successfully",
        count: filtered.length,
        productStock: filtered
      });
    }

    // Case 2: Single update (single { ProductId, Stock } object)
    const { ProductId, Stock } = body;

    if (!ProductId || Stock === undefined) {
      return res.status(400).json({ message: "ProductId and Stock are required" });
    }

    const updatedStock = await productStockModel.findOneAndUpdate(
      { ProductId },
      { $set: { Stock } },
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Single product stock updated successfully",
      productStock: updatedStock
    });

  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({
      message: "Error updating stock",
      error: error.message
    });
  }
};

exports.updateStockAfterOrder = async (req, res) => {
  try {
    const { orderId, products } = req.body; // Expecting orderId + array of products

    if (!orderId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "OrderId and products are required" });
    }

    const updatePromises = products.map(async (item) => {
      const ProductId = item._id;
      const orderedQty = item.qty;

      // Update stock only if this order hasn't updated it yet
    const updatedProduct = await productStockModel.findOneAndUpdate(
  { 
    ProductId, 
    Stock: { $gte: orderedQty }, 
    updatedOrders: { $not: { $elemMatch: { orderId: orderId } } }
  },
  { 
    $inc: { Stock: -orderedQty },
    $push: { updatedOrders: { orderId: orderId } }
  },
  { new: true }
);

      if (!updatedProduct) {
        console.warn(`No stock entry found or already updated for ProductId: ${ProductId}`);
      }

      return updatedProduct;
    });

    const updatedStocks = await Promise.all(updatePromises);
    const validUpdates = updatedStocks.filter(Boolean);

    return res.status(200).json({
      message: "Stock updated successfully after order",
      count: validUpdates.length,
      updatedProducts: validUpdates
    });

  } catch (error) {
    console.error("Error updating stock after order:", error);
    res.status(500).json({
      message: "Error updating stock after order",
      error: error.message
    });
  }
};

// Update single product stock by _id
exports.updateSingleProductStockById = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB _id
    const { Stock, productName, ProductId } = req.body;

    if (Stock === undefined && !productName && !ProductId) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const updatedStock = await productStockModel.findByIdAndUpdate(
      id,
      { $set: { Stock, productName, ProductId } },
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Product stock not found" });
    }

    res.status(200).json({
      message: "Product stock updated successfully",
      productStock: updatedStock,
    });
  } catch (error) {
    console.error("Error updating single product stock:", error);
    res.status(500).json({
      message: "Error updating product stock",
      error: error.message,
    });
  }
};

// Delete single product stock by _id
exports.deleteSingleProductStock = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await productStockModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product stock not found" });
    }

    res.status(200).json({
      message: "Product stock deleted successfully",
      deletedProduct: deleted,
    });
  } catch (error) {
    console.error("Error deleting product stock:", error);
    res.status(500).json({
      message: "Error deleting product stock",
      error: error.message,
    });
  }
};



exports.deleteAllProductStock = async(req,res)=>{
    try {
    await productStockModel.deleteMany({});
    res.status(200).json({
        message:"Deleted"
    })
    } catch (error) {
        res.status(500).json({
            message:"not Deleted"
        })
    }
    
}



