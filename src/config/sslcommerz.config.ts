import { ConfigService } from '@nestjs/config';

export const getSslcommerzConfig = (configService: ConfigService) => ({
  storeId: configService.get('SSLCOMMERZ_STORE_ID', 'your_store_id'),
  storePassword: configService.get('SSLCOMMERZ_STORE_PASSWORD', 'your_store_password'),
  baseUrl: configService.get('SSLCOMMERZ_BASE_URL', 'https://sandbox.sslcommerz.com'),
  successUrl: configService.get('SSLCOMMERZ_SUCCESS_URL', 'http://localhost:3000/payment/success'),
  failUrl: configService.get('SSLCOMMERZ_FAIL_URL', 'http://localhost:3000/payment/fail'),
  cancelUrl: configService.get('SSLCOMMERZ_CANCEL_URL', 'http://localhost:3000/payment/cancel'),
  ipnUrl: configService.get('SSLCOMMERZ_IPN_URL', 'http://localhost:3000/payment/ipn'),
  isSandbox: configService.get('NODE_ENV') !== 'production',
}); 