/**
 * Central configuration file that selects the appropriate environment variables
 * based on NODE_ENV
 */

const config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Server
  port: process.env.PORT || 5000,
  
  // Database
  mongoUri: process.env.NODE_ENV === 'production' 
    ? process.env.MONGO_URI_PROD 
    : process.env.MONGO_URI_DEV,
  
  // Frontend URL
  frontendUrl: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL_PROD || 'https://reikidevs-official.vercel.app'
    : process.env.FRONTEND_URL_DEV || 'http://localhost:3000',
  
  // Backend URL
  backendUrl: process.env.NODE_ENV === 'production'
    ? process.env.BACKEND_URL_PROD
    : process.env.BACKEND_URL_DEV,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET,
  
  // Debug info
  isDevelopment: process.env.NODE_ENV !== 'production',
};

// Log configuration on startup (excluding sensitive data)
console.log('=== Application Configuration ===' );
console.log(`Environment: ${config.nodeEnv}`);
console.log(`Port: ${config.port}`);
console.log(`Frontend URL: ${config.frontendUrl}`);
console.log(`Backend URL: ${config.backendUrl}`);
console.log(`Database: ${config.nodeEnv === 'production' ? 'Production DB' : 'Development DB'}`);
console.log('==============================');

module.exports = config;