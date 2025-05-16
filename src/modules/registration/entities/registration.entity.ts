import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PaymentMethod } from '../../payment/types/payment-method.enum';

@Entity('registrations')
export class Registration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  batch: string;

  @Column()
  department: string;

  @Column({ nullable: true })
  currentOrganization?: string;

  @Column({ nullable: true })
  designation?: string;

  @Column()
  address: string;

  @Column({ default: false })
  paymentCompleted: boolean;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod?: PaymentMethod;

  @Column({ nullable: true })
  paymentTransactionId?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  paymentAmount?: number;

  @Column({ type: 'timestamp', nullable: true })
  paymentInitiatedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  paymentCompletedAt?: Date;

  @Column({ type: 'enum', enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: 'PENDING' | 'APPROVED' | 'REJECTED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 