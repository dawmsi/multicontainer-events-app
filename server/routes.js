import events from "./controllers/events.js";
import registration from "./controllers/registration.js";
import users from "./controllers/users.js";

export const attachPublicRoutes = (app) => {
  app.get("/", async () => {
    res.send("Your Welcome");
  });

  app.post("/events/create", events.create);
  app.get("/events/", events.read);
  app.get("/events/:id/", events.readById);

  app.get("/users/", users.read);

  app.post("/events/:id/register/", registration.create);
  app.get("/registrations/:eventId/", registration.readById);
};
