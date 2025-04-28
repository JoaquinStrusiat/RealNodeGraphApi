const router = require('express').Router();
const fs = require("fs");
const path = require("path");

const routesDir = fs.readdirSync(__dirname);

routesDir.forEach(file => {
    const filePath = path.join(__dirname, file); 
    if (fs.lstatSync(filePath).isFile() && file !== "router.js" && file.endsWith(".js" )) {
        try {
            const fileName = file.replace(".js", "");
            router.post( `/${fileName}`, require(filePath));
        } catch (err) {
            console.error(`Error importing module ${filePath}:`, err.message);
        }
    }
});

module.exports = router;

