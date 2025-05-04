const mongoose = require('mongoose');
let URL;

const conectToDataBase = async (env) => {
    const {DB_URL} = env;
    if (DB_URL) {
        URL = DB_URL;
    } else {
        console.error("The envirement variable DB_URL is not defined. Please set it in the .env file ");
    }

    if(URL){
        try {
            await mongoose.connect(URL);
        } catch (err) {
            console.error("--- Error de conexión a la base de datos: ", err);
        }
    }
}


mongoose.connection.on('connected', () => console.log('Connected: ', URL));
mongoose.connection.on('open', () => console.log('Open Conection'));
mongoose.connection.on('error', (error) => console.log(`Error in ${URL}: `, error));
mongoose.connection.on('disconnected', () => console.log('Disconnected: ', URL));
mongoose.connection.on('reconnected', () => console.log('Reconnected: ', URL));
mongoose.connection.on('disconnecting', () => console.log('Disconnecting'));
mongoose.connection.on('close', () => console.log('Close Conection'));

module.exports = conectToDataBase;