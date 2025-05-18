import { Controller, Post, Get, Res, Query, Body, HttpStatus, Logger, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { InitiatePaymentDto } from '../dtos/initiate-payment.dto';
import { VerifyPaymentDto } from '../dtos/verify-payment.dto';
import { PaymentTransactionResponseDto } from '../dtos/payment-transaction-response.dto';
import { Response } from 'express';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @ApiOperation({
    summary: 'Initiate a payment',
    description: 'Initiates a payment transaction with SSLCommerz payment gateway. The user will be redirected to SSLCommerz gateway to choose their payment method.'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment initiated successfully. Returns the SSLCommerz gateway URL.',
    type: PaymentTransactionResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto) {
    try {
      this.logger.log(`Initiating payment for registration: ${initiatePaymentDto.registrationId}`);
      const result = await this.paymentService.initiatePayment(
        initiatePaymentDto.registrationId,
        initiatePaymentDto.amount
      );
      this.logger.debug(`Payment initiated successfully for registration: ${initiatePaymentDto.registrationId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to initiate payment: ${error.message}`);
      throw error;
    }
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify a payment',
    description: 'Verifies the payment status with SSLCommerz'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payment verification result',
    type: PaymentTransactionResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid transaction ID or verification failed'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found'
  })
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    try {
      this.logger.log(`Verifying payment for transaction: ${verifyPaymentDto.transactionId}`);
      const result = await this.paymentService.handlePaymentCallback(
        verifyPaymentDto.transactionId,
        verifyPaymentDto.status,
        verifyPaymentDto.validationId,
      );
      this.logger.debug(`Payment verification completed for transaction: ${verifyPaymentDto.transactionId}`);
      return result;
    } catch (error) {
      this.logger.error(`Payment verification failed: ${error.message}`);
      throw error;
    }
  }

  @Post('success')
  @ApiOperation({
    summary: 'SSLCommerz success redirect',
    description: 'Handles SSLCommerz success callback from gateway and redirects to frontend',
  })
  @ApiResponse({
    status: HttpStatus.SEE_OTHER,
    description: 'Redirected to frontend success page',
  })
  async handleSslSuccess(
    @Query('tran_id') transactionId: string,
    @Query('val_id') validationId: string,
    @Query('status') status: string,
    @Res() res: Response, // ✅ Express Response
  ) {
    try {
      this.logger.log(`SSLCommerz success callback for transaction: ${transactionId}`);

      await this.paymentService.handlePaymentCallback(transactionId, status, validationId);

      const redirectUrl = `http://localhost:3030/payment/success?status=success&transactionId=${transactionId}`;
      return res.redirect(HttpStatus.SEE_OTHER, redirectUrl);
    } catch (error) {
      this.logger.error(`Payment verification failed: ${error.message}`);
      const errorUrl = `http://localhost:3030/payment/failure?status=failed&error=${encodeURIComponent(error.message)}`;
      return res.redirect(HttpStatus.SEE_OTHER, errorUrl);
    }
  }
} 