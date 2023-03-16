const router = require("express").Router();
const storeController = require('../controllers/store_controllers');
const checkAccount = require('../middleware/middlewareAccount');


router.get('/getallstore',storeController.getAllStoreController);
router.get('/getastore/:id',storeController.getAStoreController);
router.get('/getpopulate',checkAccount.checkToken,storeController.getPopulateStoreController);

module.exports = router;