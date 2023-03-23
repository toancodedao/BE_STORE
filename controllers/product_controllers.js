const petStore = require('../models/petStore_models')
const productStore = require('../models/productStore_models')
const serviceStore = require('../models/serviceStore_models')
const productService = require('../services/product_service')

const productCrollers = {
    addProduct: async (req, res) => {
        try {
            req.body.image = req.dowloadUrl
            const token_headers = req.headers.token;
            const token = await token_headers.split(' ');
            req.body.timeService = JSON.parse(req.body.timeService)
            console.log('boddyyyy', req.body)
            await productService.addProductService(req.body, token[1])
            res.status(200).json({
                message: 'sussecfully'
            })
        } catch (error) {
            res.status(500).json({
                message: 'failed'
            })
        }
    },
    editProductController: async (req, res) => {
        try {
            const id = req.body._id;
            const nameModel = req.body.nameModel
            delete req.body._id
            delete req.body.nameModel
            const object = req.body
            const editProduct = await productService.editProductService(id, object, nameModel)
            if (editProduct == 1) {
                res.status(200).json({
                    message: 'edtting sussecfully'
                })
            }else{
                res.status(404).json({
                    message: 'edtting not found'
                })
            }
        } catch (error) {
            res.status(500).json({
                message: 'error system service'
            })
        }
    },
    deleteProductController: async (req, res) => {
        try {
            const id = req.body.id;
            const nameModel = req.body.nameModel
            const token_headers = req.headers.token;
            const token = await token_headers.split(' ');
            const removeProduct = await productService.delteProductService(id, nameModel,token[1]);
            console.log(removeProduct)
            if (removeProduct == 1) {
                res.status(200).json({
                    message: "remove product successfully"
                })
            } else {
                res.status(404).json({
                    message: "id not found"
                })
            }
        } catch (error) {
            res.status(500).json({
                message: "error system service"
            })
        }
    }
}

module.exports = productCrollers




