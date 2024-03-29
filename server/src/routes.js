const express = require("express");
const multer = require("multer");
const verifyToken = require("./config/verifyToken");

const UserController = require("./controllers/UserController");
const EventController = require("./controllers/EventController");
const DashboardController = require("./controllers/DashboardController");
const LoginControllers = require("./controllers/LoginController");
const RegistrationController = require("./controllers/RegistrationController");
const ApprovalController = require("./controllers/ApprovalController");
const RejectionController = require("./controllers/RejectionController");
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
routes.get(
  "/registration",
  verifyToken,
  RegistrationController.getMyRegistrations
);
routes.post(
  "/registration/:eventId",
  verifyToken,
  RegistrationController.create
);
routes.post(
  "/registration/:registration_id/approvals",
  verifyToken,
  ApprovalController.approval
);
routes.post(
  "/registration/:registration_id/rejections",
  verifyToken,
  RejectionController.rejection
);

//Login
routes.post("/login", LoginControllers.store);

// Dashboard
routes.get("/dashboard/:sport", verifyToken, DashboardController.getAllEvents);
routes.get("/dashboard", verifyToken, DashboardController.getAllEvents);
routes.get("/user/events", verifyToken, DashboardController.getEventsByUserId);
routes.get("/event/:eventId", verifyToken, DashboardController.getEventById);

// Event
routes.post(
  "/event",
  verifyToken,
  upload.single("thumbnail"),
  EventController.createEvent
);
routes.delete("/event/:eventId", verifyToken, EventController.delete);

// User
routes.post("/user/register", UserController.createUser);
routes.get("/user/:userId", UserController.getUserById);

module.exports = routes;
