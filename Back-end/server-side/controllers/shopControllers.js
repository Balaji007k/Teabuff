const {shopModel} = require('../models/Models')

exports.getShop = async(req,res,next)=>{
    const shops = await shopModel.find({})
    res.json({
        shops
    })
}


exports.createShop = async(req,res,next)=>{
    try {
        const {url,content} = req.body
    const shops = {
        url,content
    }
    const newShop = await shopModel.create(shops)
    newShop.save()
    res.json({
        newShop
    })
    } catch (error) {
        res.json({
            message:"not created"
        })
    }
}

exports.updateShop = async(req,res)=>{
    try {
        const id = req.params.id;
        const {url,content} = req.body;
    const shops = {
        url,content
    }
    const updatedShop = await shopModel.findByIdAndUpdate(id,shops,{new:true})
    updatedShop.save()
    res.json({
        updatedShop
    })
    } catch (error) {
        res.json({
            message:"not created"
        })
    }
    
}