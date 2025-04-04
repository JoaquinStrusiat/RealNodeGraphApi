// Access method router
const router = require('express').Router();
const fs = require("fs");
const path = require("path");

const moduleDir = fs.readdirSync(__dirname);

moduleDir.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if(fs.lstatSync(dirPath).isDirectory()){
        const filePath = path.join(dirPath, "routes.js");
        if(fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()){
            try{
                router.use(require(filePath))
            } catch (err) {
                console.error(`Error importing module: ${filePath}:`);
            }
            
        } else {
            console.log("Routes file not found: ", filePath)
        }
    }
})

module.exports = router;