const mongoose = require("mongoose")

const AppUser = new mongoose.Schema({
    numero: {
        type:Number,
    },
    senha: {
        type:String,
    },
    user_inf:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "InfAppUser",
    },
    isTrial: {
        type: Boolean,
        default: false,
    },
    trialTestsUsed: {
        type: Number,
        default: 0,
    },
    deviceId: {
        type: String,
    },
}, {
    timestamps:  true,
    toJSON: {
        transform(doc, obj){
            obj.id = obj._id
            delete obj.senha
            delete obj.createdAt
            delete obj.updatedAt        
        }
    }
})

module.exports= mongoose.model("AppUser", AppUser);