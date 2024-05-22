import express from "express";
import cors from "cors";

import { attachPublicRoutes } from "./routes.js";
import { PORT } from "./config.js";
import users from "./controllers/users.js";
import fetchAnotherApi from "./fetchAnotherApi.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const updateTime = 60000 / 5;
export const autoFetch = setInterval(fetchAnotherApi, updateTime);
fetchAnotherApi();

attachPublicRoutes(app);

const server = app.listen(PORT, async () => {
  const address = server.address();
  console.log(`API listening on port ${address.port}`);
  try {
    const count = await users.readCount();
    console.log("Connected to the database! User count:", count);
    console.log(`By default app working on 'http://localhost:3050'`);
  } catch (error) {
    console.log("Error connecting to the database");
  }
});
