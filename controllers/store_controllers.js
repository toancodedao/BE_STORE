const StoreService = require('../services/store_service')


const storeController = {
    getAllStoreController:async(req,res)=>{
        try {
            const getAllStore = await StoreService.getAllStoreService()
            if(getAllStore == 2){
                res.status(404).json({
                    message:'store not found'
                })
            }else{
                res.status(200).json({
                    message:'get all store successfully',
                    data: getAllStore
                })
            }
        } catch (error) {
            res.status(404).json({
                message: 'error system service'
            })
        }
    },
    getAStoreController:async(req,res)=>{
        const id = req.params.id;
        const getAStore = await StoreService.getAStoreService(id)
        if(getAStore == 2){
            res.status(404).json({
                message:'storeID not found'
            })
        }else{
            res.status(200).json({
                message:'get store successfully',
                data: getAStore
            })
        }
    },
    getPopulateStoreController:async(req,res)=>{
       try {
        const token_headers = req.headers.token;
        const token = await token_headers.split(' ');

        const getPopulateStore = await StoreService.getPopulateService(token[1])
      
        if(getPopulateStore == 2){
            res.status(404).json({
                message:'populate not found',
            })
        }else{
            res.status(200).json({
                message:'get populate successfully',
                data:getPopulateStore
            })
        }
       } catch (error) {
        res.status(500).json({
            message:'error getting populate'
        })
       }
    }
}

module.exports = storeController