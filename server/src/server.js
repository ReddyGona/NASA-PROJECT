const http = require("http");
/* Seperated Express MiddleWare */
const app = require("./app");
/* APPLIES OVER ALL */
require("dotenv").config();

const { loadPlanetsData } = require("./models/planets.model");
const { mongoConnect } = require("./services/mongo");
const { loadLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

/* Built-In http server */
const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
}

startServer();
