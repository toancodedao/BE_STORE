const { petStore } = require('../models/petStore_models')
const { productStore } = require('../models/productStore_models')
const { serviceStore } = require('../models/serviceStore_models')
const { AccountStore } = require('../models/accounts_models')

const jwt = require("jsonwebtoken");


const productService = {
    addProductService: async (body, token) => {
        try {
            if (body.nameModel == "productStore") {
                const token2 = jwt.decode(token, { complete: true });
                const UserEmail = token2.payload.token;
                const ObjectProductStore = new productStore({
                    nameProduct: body.nameProduct,
                    priceProduct: body.priceProduct,
                    imgProduct: body.image,
                    descriptionProduct: body.descriptionProduct,
                    quantityProduct: body.quantityProduct,
                    typeProduct: body.typeProduct,
                    codeProduct: body.codeProduct
                })
                const id = await ObjectProductStore.save();
                const _id = id._id
                await AccountStore.findOneAndUpdate({ emailStore: UserEmail }, { $push: { idProductStore: _id } })
            }
            if (body.nameModel == "serviceStore") {
                const token2 = jwt.decode(token, { complete: true });
                const UserEmail = token2.payload.token;
                const ObjectserviceStore = new serviceStore({
                    nameService: body.nameService,
                    priceService: body.priceService,
                    imgService: body.image,
                    descriptionService: body.descriptionService,
                    typeService: body.typeService,
                    quantityService: body.quantityService,
                })
                const id = await ObjectserviceStore.save();
                const _id = id._id
                await AccountStore.findOneAndUpdate({ emailStore: UserEmail }, { $push: { idServiceStore: _id } })
            }
            if (body.nameModel == "petStore") {
                const token2 = jwt.decode(token, { complete: true });
                const UserEmail = token2.payload.token;
                const ObjectPetStore = new petStore({
                    namePet: body.namePet,
                    agePet: body.agePet,
                    typePet: body.typePet,
                    imgPet: body.image,
                    pricePet: body.pricePet,
                    quantityPet: body.quantityPet,
                    descriptionPet: body.descriptionPet,
                    genderPet: body.genderPet,
                    code: body.code
                })
                const id = await ObjectPetStore.save();
                const _id = id._id
                await AccountStore.findOneAndUpdate({ emailStore: UserEmail }, { $push: { idpetStore: _id } })
            }
        } catch (error) {

        }
    },
    editProductService: async (id, object, nameModel) => {
        console.log(object)
        try {
            if (nameModel == "productStore") {
                const editProduct = await productStore.findByIdAndUpdate(id, object);
                if(editProduct){
                    return 1;
                }else{
                    return 2
                }
            }
            if (nameModel == "serviceStore") {
                const editProduct = await serviceStore.findByIdAndUpdate(id, object)
                    if(editProduct){
                        return 1;
                    }else{
                        return 2
                    }
                
            }
            if (nameModel == "petStore") {
                const editProduct = await petStore.findByIdAndUpdate(id, object)
                    if(editProduct){
                        return 1;
                    }else{
                        return 2
                    }
            }
        } catch (error) {
            console.log(error);
        }
    },
    delteProductService:async(id,nameModel,token)=>{
        const token2 = jwt.decode(token, { complete: true });
        const UserEmail = token2.payload.token;
        try {
            if (nameModel == "productStore") {
                await AccountStore.findOneAndUpdate({ emailStore: UserEmail }, { $pull: { idProductStore: id } })
                const removeProduct = await productStore.findByIdAndRemove(id);
                if(removeProduct){
                    return 1
                }else{
                    return 2
                }
            }
            if (nameModel == "serviceStore") {
                await AccountStore.findOneAndUpdate({ emailStore: UserEmail }, { $pull: { idServiceStore: id } })
                const removeProduct = await serviceStore.findByIdAndRemove(id);
                if(removeProduct){
                    return 1
                }else{
                    return 2
                }
            }
            if (nameModel == "petStore") {
                await AccountStore.findOneAndUpdate({ emailStore: UserEmail }, { $pull: { idpetStore: id } })
                const removeProduct = await petStore.findByIdAndRemove(id);
                if(removeProduct){
                    return 1
                }else{
                    return 2
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = productService