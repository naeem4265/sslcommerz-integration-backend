import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AdminRepository } from '../repositories/admin.repository';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { LoginAdminDto } from '../dtos/login-admin.dto';
import { Admin } from '../entities/admin.entity';
import { getJwtConfig } from '../../../config/jwt.config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtConfig;

  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = getJwtConfig(configService);
  }

  async register(createAdminDto: CreateAdminDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, email, password, secretKey } = createAdminDto;
    
    // Verify secret key
    if (secretKey !== this.jwtConfig.adminSecretKey) {
      this.logger.warn(`Admin registration attempt with invalid secret key: ${secretKey}`);
      throw new UnauthorizedException('Invalid admin secret key');
    }

    // Check if username or email already exists
    const existingUsername = await this.adminRepository.findByUsername(username);
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    const existingEmail = await this.adminRepository.findByEmail(email);
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create admin
    const admin = await this.adminRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = await this.generateTokens(admin);
    
    // Save refresh token
    await this.updateRefreshToken(admin.id, tokens.refreshToken);
    
    this.logger.log(`Admin registered successfully: ${username}`);
    return tokens;
  }

  async login(loginAdminDto: LoginAdminDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = loginAdminDto;
    
    // Find admin by username
    const admin = await this.adminRepository.findByUsername(username);
    if (!admin) {
      this.logger.warn(`Login attempt for non-existent admin: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.comparePasswords(password, admin.password);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password for admin: ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(admin);
    
    // Save refresh token
    await this.updateRefreshToken(admin.id, tokens.refreshToken);
    
    this.logger.log(`Admin logged in successfully: ${username}`);
    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfig.secret,
      });

      // Find admin by ID from token payload
      const admin = await this.adminRepository.findById(payload.sub);
      if (!admin || admin.refreshToken !== refreshToken) {
        this.logger.warn(`Invalid refresh token for admin ID: ${payload.sub}`);
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(admin);
      
      // Save new refresh token
      await this.updateRefreshToken(admin.id, tokens.refreshToken);
      
      this.logger.log(`Token refreshed successfully for admin: ${admin.username}`);
      return tokens;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(adminId: string): Promise<void> {
    const admin = await this.adminRepository.findById(adminId);
    if (admin) {
      // Remove refresh token
      admin.refreshToken = undefined;
      await this.adminRepository.save(admin);
      this.logger.log(`Admin logged out successfully: ${admin.username}`);
    }
  }

  private async generateTokens(admin: Admin): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { username: admin.username, sub: admin.id, role: admin.role };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtConfig.secret,
        expiresIn: this.jwtConfig.accessTokenExpiration,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtConfig.secret,
        expiresIn: this.jwtConfig.refreshTokenExpiration,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(adminId: string, refreshToken: string): Promise<void> {
    const admin = await this.adminRepository.findById(adminId);
    if (admin) {
      admin.refreshToken = refreshToken;
      await this.adminRepository.save(admin);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
} 