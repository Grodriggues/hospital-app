const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cadastro = new Schema({
    nome:{
        type:String,
        require:true
    },

    nascimento:{
        type:String,
        require:true
    },

    cpf:{
        type:Number,
        require:true
    },

    rg:{
        type:Number,
        require:true
    },
    cidade:{
        type:String,
        require:true
    },
    estado:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    }
});

mongoose.model("cadastro",Cadastro);