export const envConfig = {
  // Refresh token settings
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
  // Server Configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
  
  // Encryption settings
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'),
  
  // Role Configuration (seller-centric)
  DEFAULT_SELLER_ROLE_ID: parseInt(process.env.DEFAULT_SELLER_ROLE_ID || '2'),
  ADMIN_ROLE_ID: parseInt(process.env.ADMIN_ROLE_ID || '1'),

  
  // Database configuration (adapted to .env variable names)
  DB_HOST: process.env.DB_CONTAINER_NAME, // In Docker, this is the service name
  DB_PORT: parseInt(process.env.POSTGRES_PORT || '5432'),
  DB_NAME: process.env.POSTGRES_DB,
  DB_USER: process.env.POSTGRES_USER,
  DB_PASSWORD: process.env.POSTGRES_PASSWORD,
};

/**
 * Validates that critical environment variables are configured
 */
export const validateEnvConfig = () => {
  const requiredVars = [
    'JWT_SECRET',
    'DB_PASSWORD'
  ];
  
  const missingVars = requiredVars.filter(varName => {
    const value = process.env[varName];
    return !value || value === 'your_password_here' || value === 'your-super-secret-jwt-key-change-this-in-production-make-it-very-long-and-random';
  });
  
  if (missingVars.length > 0) {
    console.warn(`Environment variables not configured: ${missingVars.join(', ')}`);
    console.warn('Create a .env file with the necessary variables');
  }
  
  return missingVars.length === 0;
};
