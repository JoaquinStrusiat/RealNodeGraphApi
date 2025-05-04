// Import express.
const express = require('express');

//Import cors, a tool to allow cross origin requests.
const cors = require('cors');
const cors_config = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'api-key'],
  credentials: true,
}

//Iport the list endpoints, a tool to list the endpoints of the app.
const listEndpoints = require('express-list-endpoints');

//Import the middlewares for the routes.
const authenticateOwner = require('./middlewares/authenticateOwner.js');
const bodyFormatVerificate = require('./middlewares/bodyFormatVerificate.js');

const createApp = (PORT) => {
  const app = express();

  //congurate cors
  app.use(cors(cors_config));
  app.options('*', cors());

  //Use the middlewares
  app.use(express.json())
  app.use(bodyFormatVerificate)

  //Impor the reoutes
  const api = require("./api/router.js")
  app.use("/api", authenticateOwner, api);

  //Import the services
  const services = require('./services/router.js');
  app.use("/services", authenticateOwner, services);

  //Import the auth routes
  const registerUser = require('./auth/registerUser.js');
  app.post("/registerUser", registerUser);

  const loginUser = require('./auth/loginUser.js');
  app.post("/loginUser", loginUser);

  // Mostrar las rutas disponibles
  app.use("/routes", (req, res) => {
    const routes = listEndpoints(app);
    const formatRoutes = routes.reduce((acc, route) => {
      if (route.path !== "*") {
        acc.push({ route: route.path, methods: route.methods })
      }
      return acc;
    }, [])
    res.json(formatRoutes)
  })

  //Mejorar esta parte
  app.all("*", async (req, res) => { res.status(404).send({ err: `Route not found: ${req.url}` }) })

  app.listen(PORT, () => { console.log(`\nTu app está lista por http://localhost:${PORT}`); });
}

module.exports = createApp;