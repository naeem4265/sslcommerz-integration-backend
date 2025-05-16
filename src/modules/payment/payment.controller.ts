import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaymentMethod } from './types/payment-method.enum';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a payment' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Payment initiated successfully' })
  async initiatePayment(
    @Body('registrationId') registrationId: string,
    @Body('amount') amount: number,
    @Body('paymentMethod') paymentMethod: PaymentMethod,
  ) {
    return this.paymentService.initiatePayment(registrationId, amount, paymentMethod);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify a payment' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Payment verified successfully' })
  async verifyPayment(@Body('transactionId') transactionId: string) {
    return {
      verified: await this.paymentService.verifyPayment(transactionId),
    };
  }
} 