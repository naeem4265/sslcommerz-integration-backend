import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { LoginAdminDto } from '../dtos/login-admin.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

// Define the JWT payload user interface
interface JwtUser {
  username: string;
  sub: string;
  role: string;
}

// Extend Express Request to include our user type
interface RequestWithUser extends ExpressRequest {
  user: JwtUser;
}

@ApiTags('admin/auth')
@Controller('admin/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new admin',
    description: 'Creates a new admin account (requires secret key)'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin registered successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or admin already exists'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid admin secret key'
  })
  async register(@Body() createAdminDto: CreateAdminDto) {
    try {
      this.logger.log(`Registering new admin: ${createAdminDto.username}`);
      const tokens = await this.authService.register(createAdminDto);
      return {
        message: 'Admin registered successfully',
        ...tokens
      };
    } catch (error) {
      this.logger.error(`Admin registration failed: ${error.message}`);
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login as admin',
    description: 'Authenticates admin and returns JWT tokens'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin logged in successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials'
  })
  async login(@Body() loginAdminDto: LoginAdminDto) {
    try {
      this.logger.log(`Admin login attempt: ${loginAdminDto.username}`);
      const tokens = await this.authService.login(loginAdminDto);
      return {
        message: 'Admin logged in successfully',
        ...tokens
      };
    } catch (error) {
      this.logger.error(`Admin login failed: ${error.message}`);
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refreshes JWT access token using refresh token'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refreshed successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid refresh token'
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      this.logger.log('Token refresh attempt');
      const tokens = await this.authService.refreshToken(refreshTokenDto.refreshToken);
      return {
        message: 'Token refreshed successfully',
        ...tokens
      };
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw error;
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout admin',
    description: 'Invalidates the refresh token'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin logged out successfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized'
  })
  async logout(@Request() req: RequestWithUser) {
    try {
      this.logger.log(`Admin logout: ${req.user.username}`);
      await this.authService.logout(req.user.sub);
      return {
        message: 'Admin logged out successfully'
      };
    } catch (error) {
      this.logger.error(`Admin logout failed: ${error.message}`);
      throw error;
    }
  }
} 