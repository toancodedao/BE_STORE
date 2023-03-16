const { AccountStore } = require('../models/accounts_models')
const jwt = require("jsonwebtoken");


const StoreService = {
    getAllStoreService:async()=>{
        try {
            const getAllStore = await AccountStore.find();
            return getAllStore
        } catch (error) {
            console.log(error)
            return 2
        }
    },
    getAStoreService:async(id)=>{
        try {
            console.log(id)
            const getAStore = await AccountStore.findById(id);
            if(getAStore) {
                return getAStore
            }else{
                return 2
            }
        } catch (error) {
            console.log(error)
        }
    },
    getPopulateService:async(token)=>{
        const token2 = jwt.decode(token, { complete: true });
        const UserEmail = token2.payload.token;
        try {
            const storePopulate = await AccountStore.findOne({ emailStore: UserEmail }).populate("idProductStore").populate('idServiceStore').populate('idpetStore');
            const myarr = []
            myarr.push(storePopulate.idProductStore,storePopulate.idServiceStore,storePopulate.idpetStore)
            if(storePopulate){
                return myarr
            }else{
                return 2
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = StoreService