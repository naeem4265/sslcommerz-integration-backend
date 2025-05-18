import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService) => {
  const nodeEnv = configService.get<string>('NODE_ENV');
  
  // Get secret keys from environment variables
  const secret = configService.get<string>('JWT_SECRET');
  const adminSecretKey = configService.get<string>('ADMIN_SECRET_KEY');
  
  // Always require secret keys, regardless of environment
  if (!secret || !adminSecretKey) {
    throw new Error(
      'JWT_SECRET and ADMIN_SECRET_KEY must be defined in .env file'
    );
  }
  
  return {
    secret,
    accessTokenExpiration: configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
    refreshTokenExpiration: configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
    adminSecretKey,
  };
}; 