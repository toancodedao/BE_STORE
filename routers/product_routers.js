const router = require("express").Router();
const productCrollers = require('../controllers/product_controllers')
const handleProduct = require('../middleware/midedlewareProduct')
const checkAccount = require('../middleware/middlewareAccount');


router.post('/addproduct',checkAccount.checkToken,handleProduct.handleForm,productCrollers.addProduct)
router.post('/edtting',checkAccount.checkToken,productCrollers.editProductController)
router.post('/delete',checkAccount.checkToken,productCrollers.deleteProductController)

module.exports = router;