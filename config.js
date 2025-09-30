module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  },

  // Database Configuration
  database: {
    url: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/user-auth",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // JWT Configuration
  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET ||
      "your_super_secure_access_secret_key_here_change_in_production",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      "your_super_secure_refresh_secret_key_here_change_in_production",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    issuer: "user-auth-server",
    audience: "user-auth-client",
  },

  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    rateLimitWindowMs:
      parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: process.env.CORS_CREDENTIALS === "true" || true,
  },

  // Cookie Configuration
  cookies: {
    secure: process.env.COOKIE_SECURE === "true" || false,
    sameSite: process.env.COOKIE_SAME_SITE || "strict",
    httpOnly: process.env.COOKIE_HTTP_ONLY === "true" || true,
    accessTokenMaxAge: 15 * 60 * 1000, // 15 minutes
    refreshTokenMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
};
