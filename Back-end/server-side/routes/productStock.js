const express = require('express')
const router = express.Router();
const { getAllProductStock,getSingleProductStock,getCartProductStock,createSingleProductStock,createMultipleProductsStock,updateProductStock,updateStockAfterOrder,updateSingleProductStockById,deleteSingleProductStock,deleteAllProductStock } = require('../controllers/ProductStockController')

router.route('/productStocks').get(getAllProductStock);
router.route('/productStock/:id').get(getSingleProductStock);
router.route('/productStocks').post(getCartProductStock);
router.route('/productStock').post(createSingleProductStock);
router.route('/productStocks').post(createMultipleProductsStock);
router.route('/productStock/:id').put(updateSingleProductStockById);
router.route('/productStock/update').patch(updateProductStock);
router.route('/productStock/update-after-order').patch(updateStockAfterOrder);
router.route('/productStock/:id').delete(deleteSingleProductStock);
router.route('/productStocks').delete(deleteAllProductStock);

module.exports= router;