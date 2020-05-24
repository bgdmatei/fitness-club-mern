const express = require("express");
const multer = require("multer");

const UserController = require("./controllers/UserController");
const EventController = require("./controllers/EventController");
const uploadConfig = require("./config/upload");

const routes = express.Router();
const upload = multer(uploadConfig);

routes.get("/", (req, res) => {
  res.send("Hello from express");
});

// Event
routes.post("/event", upload.single("thumbnail"), EventController.createEvent);
routes.get("/event/:eventId", EventController.getEventById);

// User
routes.post("/user/register", UserController.createUser);
routes.get("/user/:userId", UserController.getUserById);

module.exports = routes;
