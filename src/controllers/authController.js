const User = require("../models/User");
const bcrypt = require("bcrypt");
const { signAccess, signRefresh, verifyAccess } = require("../utils/jwt");

const SALT_ROUNDS = 12;

function cookieOptions(isRefresh = false) {
  const isProd = process.env.NODE_ENV === "production";
  const base = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  };
  if (process.env.COOKIE_DOMAIN) base.domain = process.env.COOKIE_DOMAIN;
  if (!isRefresh) base.maxAge = 15 * 60 * 1000; // 15 minutes
  else base.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  return base;
}

class AuthController {
  // Render signup page
  static async renderSignup(req, res) {
    try {
      res.render("signup", {
        title: "Sign Up",
        error: req.query.error || null,
        success: req.query.success || null,
      });
    } catch (error) {
      console.error("Render signup error:", error);
      res.status(500).render("signup", {
        title: "Sign Up",
        error: "An error occurred. Please try again.",
      });
    }
  }

  // Handle signup form submission
  static async handleSignup(req, res) {
    try {
      const { name, username, email, password } = req.body;

      // Validation
      if (!name || !username || !email || !password) {
        return res.redirect("/signup?error=All fields are required");
      }

      // Check if user already exists
      const exists = await User.findOne({ $or: [{ email }, { username }] });
      if (exists) {
        return res.redirect("/signup?error=User already exists");
      }

      // Hash password and create user
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await User.create({ name, username, email, passwordHash });

      // Create tokens
      const payload = { sub: user._id.toString(), username: user.username };
      const accessToken = signAccess(payload);
      const refreshToken = signRefresh(payload);

      // Set cookies
      res.cookie("accessToken", accessToken, cookieOptions(false));
      res.cookie("refreshToken", refreshToken, cookieOptions(true));

      // Redirect to dashboard
      res.redirect("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);

      if (err?.code === 11000) {
        return res.redirect("/signup?error=Email or username already taken");
      }

      res.redirect("/signup?error=An error occurred during signup");
    }
  }

  // Render login page
  static async renderLogin(req, res) {
    try {
      res.render("login", {
        title: "Sign In",
        error: req.query.error || null,
        success: req.query.success || null,
      });
    } catch (error) {
      console.error("Render login error:", error);
      res.status(500).render("login", {
        title: "Sign In",
        error: "An error occurred. Please try again.",
      });
    }
  }

  // Handle login form submission
  static async handleLogin(req, res) {
    try {
      const { emailOrUsername, password } = req.body;

      // Validation
      if (!emailOrUsername || !password) {
        return res.redirect("/login?error=All fields are required");
      }

      // Find user
      const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });

      if (!user) {
        return res.redirect("/login?error=Invalid credentials");
      }

      // Verify password
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.redirect("/login?error=Invalid credentials");
      }

      // Create tokens
      const payload = { sub: user._id.toString(), username: user.username };
      const accessToken = signAccess(payload);
      const refreshToken = signRefresh(payload);

      // Set cookies
      res.cookie("accessToken", accessToken, cookieOptions(false));
      res.cookie("refreshToken", refreshToken, cookieOptions(true));

      // Redirect to dashboard
      res.redirect("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      res.redirect("/login?error=An error occurred during login");
    }
  }

  // Render dashboard
  static async renderDashboard(req, res) {
    try {
      // Check if user is authenticated
      const token = req.cookies?.accessToken;

      if (!token) {
        return res.redirect(
          "/login?error=Please log in to access the dashboard"
        );
      }

      try {
        const decoded = verifyAccess(token);
        const user = await User.findById(decoded.sub).select("-passwordHash");

        if (!user) {
          return res.redirect("/login?error=User not found");
        }

        res.render("dashboard", {
          title: "Dashboard",
          user: {
            userId: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
          },
        });
      } catch (tokenError) {
        console.error("Token verification error:", tokenError);
        res.redirect("/login?error=Invalid or expired session");
      }
    } catch (error) {
      console.error("Render dashboard error:", error);
      res.status(500).render("dashboard", {
        title: "Dashboard",
        error: "An error occurred while loading the dashboard",
      });
    }
  }

  // Handle logout
  static async handleLogout(req, res) {
    try {
      // Clear cookies
      const base = cookieOptions(false);
      const baseRefresh = cookieOptions(true);
      res.clearCookie("accessToken", base);
      res.clearCookie("refreshToken", baseRefresh);

      // Redirect to login page
      res.redirect("/login?success=You have been logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      res.redirect("/login?error=An error occurred during logout");
    }
  }

  // Render home page
  static async renderHome(req, res) {
    try {
      res.render("index", {
        title: "Home",
      });
    } catch (error) {
      console.error("Render home error:", error);
      res.status(500).render("index", {
        title: "Home",
        error: "An error occurred while loading the page",
      });
    }
  }
}

module.exports = AuthController;
