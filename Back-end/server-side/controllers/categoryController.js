// const {categoryModel} = require('../models/Models')

// exports.getCategory = async(req,res,next)=>{
//     const categorys = await categoryModel.find({})
//     res.json({
//         categorys
//     })
// }


// exports.createCategory = async(req,res,next)=>{
//     try {
//         const {categoryId,name} = req.body
//     const categorys = {
//         categoryId,
//         name
//     }
//     const category = await categoryModel.create(categorys)
//     category.save()
//     res.json({
//         category
//     })
//     } catch (error) {
//         res.json({
//             message:"not created"
//         })
//     }
    
// }

// exports.updateCategory = async (req, res) => {
//   try {
//     const id = req.params.id;  // category _id from URL params
//     const { categoryId, name } = req.body;

//     const categorys = { categoryId, name };

//     // Correct usage of findByIdAndUpdate
//     const category = await categoryModel.findByIdAndUpdate(
//       id,                  // just pass the id
//       categorys,           // update object
//       { new: true }        // return the updated document
//     );

//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.json({
//       message: "Category updated successfully",
//       category
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Not updated",
//       error: error.message
//     });
//   }
// };


// exports.deleteCategory = async (req, res) => {
//   try {
//     const id = req.params.id; // category _id from URL params

//     const category = await categoryModel.findByIdAndDelete(id);

//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.json({
//       message: "Category deleted successfully",
//       category
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Not deleted",
//       error: error.message
//     });
//   }
// };

const { categoryModel } = require('../models/Models');

// Get all categories
exports.getCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.json({ categories });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Create new category (with optional offer)
exports.createCategory = async (req, res) => {
  try {
    const { categoryId, name, offer } = req.body;

    // Check if categoryId already exists
    const existingCategory = await categoryModel.findOne({ categoryId });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = await categoryModel.create({
      categoryId,
      name,
      offer: offer || 0,
    });

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Not created",
      error: error.message,
    });
  }
};

// Update category (including offer)
exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id; // category _id from URL params
    const { categoryId, name, offer } = req.body;

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { categoryId, name, offer },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Not updated",
      error: error.message,
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCategory = await categoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Not deleted",
      error: error.message,
    });
  }
};
