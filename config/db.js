const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({path:'variables.env'})

const conectarDB = async () => {
    try {
        
        await mongoose.connect(process.env.MONGO_DB,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('DB conectada');
        
    } catch (error) {
        
        console.log('A ocurrido un error al conectar la base de datos');
        console.log(error);
        process.exit(1); // detener la app

    }
}

module.exports = conectarDB;
