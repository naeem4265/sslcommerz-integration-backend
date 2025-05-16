import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PaymentMethod } from '../types/payment-method.enum';
import { Registration } from '../../registration/entities/registration.entity';

@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transactionId: string;

  @Column({ type: 'uuid' })
  registrationId: string;

  @ManyToOne(() => Registration)
  @JoinColumn({ name: 'registrationId' })
  registration: Registration;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentUrl: string;

  @Column({ type: 'enum', enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'PENDING' })
  status: 'PENDING' | 'COMPLETED' | 'FAILED';

  @Column({ nullable: true })
  gatewayResponse?: string;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  failedAt?: Date;

  @Column({ nullable: true })
  failureReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 