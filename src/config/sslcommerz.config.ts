export const sslcommerzConfig = {
  storeId: process.env.SSLCOMMERZ_STORE_ID || 'your_store_id',
  storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || 'your_store_password',
  baseUrl: process.env.SSLCOMMERZ_BASE_URL || 'https://sandbox.sslcommerz.com',
  successUrl: process.env.SSLCOMMERZ_SUCCESS_URL || 'http://localhost:3000/payment/success',
  failUrl: process.env.SSLCOMMERZ_FAIL_URL || 'http://localhost:3000/payment/fail',
  cancelUrl: process.env.SSLCOMMERZ_CANCEL_URL || 'http://localhost:3000/payment/cancel',
  ipnUrl: process.env.SSLCOMMERZ_IPN_URL || 'http://localhost:3000/payment/ipn',
  isSandbox: process.env.NODE_ENV !== 'production',
}; 