const mongoose = require('mongoose');

const accountStoreShacma = new mongoose.Schema({
  nameStore: {
    type: "String",
    require: 'true',
    unique: true
  },
  emailStore: {
    type: "String",
    require: 'true',
    unique: true
  },
  passStore: {
    type: "String",
    require: 'true'
  },
  starStore: {
    type: "Number",
  },
  addressStore: [{
    type: "String",
    require: "true"
  }],
  phoneStore: {
    type: "String",
    require: "true"
  },
  idProductStore: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "productStore"
  }],
  idServiceStore: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "serviceStore"
  }],
  idpetStore: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "petStore"
  }],
  otpMailStore: {
    type: "Number",
  },
  avtStore: {
    type: "String",
  },
  descriptionStore: {
    type: "String",
  },
  socketId: {
    type: "String"
  },
  tokenFCM: {
    type: "String"
  },
});

const AccountStore = mongoose.model('AccountStore', accountStoreShacma);
module.exports = { AccountStore }