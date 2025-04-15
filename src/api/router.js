const router = require('express').Router();
const fs = require("fs");
const path = require("path");

const routesPath = path.join(__dirname, "routes"); 
const routesDir = fs.readdirSync(routesPath);

routesDir.forEach(file => {
    const filePath = path.join(routesPath, file); 
    if (fs.lstatSync(filePath).isFile()) {
        try {
            router.use(require(filePath));
        } catch (err) {
            console.error(`Error importing module ${filePath}:`, err.message);
        }
    }
});

module.exports = router;

