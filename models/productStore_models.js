const mongoose = require('mongoose');

const productStoreShecma = new mongoose.Schema({
    nameProduct:{
        type:"String",
        require:"true"
    },
    priceProduct:{
        type:"String",
        require:"true"
    },
    imgProduct:{
        type:"String",
        require:"true"
    },
    descriptionProduct:{
        type:"String",
        require:"true"
    },
    quantityProduct:{
        type:"String",
        require:"true"
    },
    typeProduct:{
        type:"String",
        require:"true"
    },
    codeProduct:{
        type:"String",
        require:"true"
    }
})

const productStore = mongoose.model("productStore",productStoreShecma)
module.exports ={productStore}