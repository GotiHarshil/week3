const fs = require("fs");
const path = require("path");

// Environment variables template
const envContent = `# Server Configuration
NODE_ENV=development
PORT=8000
FRONTEND_ORIGIN=http://localhost:3000

# Database Configuration
MONGODB_URL=mongodb://127.0.0.1:27017/user-auth

# JWT Configuration
JWT_ACCESS_SECRET=your_super_secure_access_secret_key_here_change_in_production
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_here_change_in_production

# Cookie Configuration (optional)
COOKIE_DOMAIN=localhost
`;

const envPath = path.join(__dirname, ".env");

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log("✅ .env file already exists");
  console.log("Current .env content:");
  console.log(fs.readFileSync(envPath, "utf8"));
} else {
  // Create .env file
  fs.writeFileSync(envPath, envContent);
  console.log("✅ Created .env file with default configuration");
  console.log("📝 Please update the JWT secrets for production use");
}

console.log("\n🚀 You can now start the server with:");
console.log("   npm start");
console.log("   or");
console.log("   npm run dev");
console.log("\n📋 Make sure MongoDB is running on your system");
