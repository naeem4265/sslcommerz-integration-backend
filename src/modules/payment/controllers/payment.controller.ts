import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { InitiatePaymentDto } from '../dtos/initiate-payment.dto';
import { VerifyPaymentDto } from '../dtos/verify-payment.dto';
import { PaymentTransactionResponseDto } from '../dtos/payment-transaction-response.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @ApiOperation({
    summary: 'Initiate a payment',
    description: 'Initiates a payment transaction with SSLCommerz payment gateway'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment initiated successfully',
    type: PaymentTransactionResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or payment method not supported'
  })
  async initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto) {
    return this.paymentService.initiatePayment(
      initiatePaymentDto.registrationId,
      initiatePaymentDto.amount,
      initiatePaymentDto.paymentMethod,
    );
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
    return this.paymentService.handlePaymentCallback(
      verifyPaymentDto.transactionId,
      verifyPaymentDto.status,
      verifyPaymentDto.validationId,
    );
  }
} 