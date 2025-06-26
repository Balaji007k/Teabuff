const {categoryModel} = require('../models/Models')

exports.getCategory = async(req,res,next)=>{
    const categorys = await categoryModel.find({})
    res.json({
        categorys
    })
}


exports.createCategory = async(req,res,next)=>{
    try {
        const {categoryId,name} = req.body
    const categorys = {
        categoryId,
        name
    }
    const category = await categoryModel.create(categorys)
    category.save()
    res.json({
        category
    })
    } catch (error) {
        res.json({
            message:"not created"
        })
    }
    
}