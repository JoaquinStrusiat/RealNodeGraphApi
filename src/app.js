const createApp = (PORT) => {
  const express = require('express');
  const app = express();

  const cors = require('cors');
  app.use(cors());
  app.use(express.json());

  // Impor the Middlewares
  const { keyAuthMiddleware, verifyBodyMiddleware } = require("./utils/middlewares.js")
  app.use(keyAuthMiddleware, verifyBodyMiddleware)

  //Impor the reoutes
  const routes = require("./modules/moduleRouter.js")
  app.use("/api", routes);

  //Mejorar esta parte
  app.all("*", async (req, res) => { res.status(404).send({ err: `Route not found: ${req.url}` }) })

  app.listen(PORT, () => { console.log(`\nTu app está lista por http://localhost:${PORT}`); });

}

module.exports = createApp;