const mongoose = require('mongoose');

const petStoreShecma = new mongoose.Schema({
    namePet:{
        type:"String",
        require:"true"
    },
    agePet:{
        type:"String",
        require:"true"
    },
    typePet:{
        type:"String",
        require:"true"
    },
    imgPet:{
        type:"String",
        require:"true"
    },
    pricePet:{
        type:"String",
        require:"true"
    },
    quantityPet:{
        type:"String",
        require:"true"
    },
    descriptionPet:{
        type:"String",
        require:"true"
    },
    genderPet:{
        type:"String",
        require:"true"
    },
    code:{
        type:"String",
        require:"true"
    }
})

const petStore = mongoose.model("petStore",petStoreShecma)
module.exports ={petStore}
