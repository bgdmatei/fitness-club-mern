const express = require("express");
const multer = require("multer");

const UserController = require("./controllers/UserController");
const EventController = require("./controllers/EventController");
const DashboardController = require("./controllers/DashboardController");
const LoginControllers = require("./controllers/LoginController");
const RegistrationController = require("./controllers/RegistrationController");
const uploadConfig = require("./config/upload");

const routes = express.Router();
const upload = multer(uploadConfig);

routes.get("/", (req, res) => {
  res.send("Hello from express");
});

// Registration
routes.get(
  "/registration/:registration_id",
  RegistrationController.getRegistration
);
routes.post("/registration/:eventId", RegistrationController.create);

//Login
routes.post("/login", LoginControllers.store);

// Dashboard
routes.get("/dashboard/:sport", DashboardController.getAllEvents);
routes.get("/dashboard", DashboardController.getAllEvents);
routes.get("/event/:eventId", DashboardController.getEventById);

// Event
routes.post("/event", upload.single("thumbnail"), EventController.createEvent);
routes.delete("/event/:eventId", EventController.delete);

// User
routes.post("/user/register", UserController.createUser);
routes.get("/user/:userId", UserController.getUserById);

module.exports = routes;
