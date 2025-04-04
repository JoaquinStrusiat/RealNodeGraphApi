const mongoose = require('mongoose');
let URL;

const conectToDataBase = async (env) => {
    const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = env;
    if (DB_USERNAME && DB_PASSWORD && DB_NAME && DB_HOST && DB_PORT) {
        URL = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`
        try {
            await mongoose.connect(URL);
        } catch (err) {
            console.error("--- Error de conexión a la base de datos: ", err);
        }
    } else {
        console.error("Error in environments values: ", { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT });
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