const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();

// Home page
router.get("/", AuthController.renderHome);

// Authentication routes
router.get("/signup", AuthController.renderSignup);
router.post("/signup", AuthController.handleSignup);

router.get("/login", AuthController.renderLogin);
router.post("/login", AuthController.handleLogin);

router.get("/dashboard", AuthController.renderDashboard);
router.post("/logout", AuthController.handleLogout);

module.exports = router;
