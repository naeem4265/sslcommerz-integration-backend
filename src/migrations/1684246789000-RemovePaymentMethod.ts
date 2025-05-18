import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePaymentMethod1684246789000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // First make the column nullable to avoid errors with existing data
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" ALTER COLUMN "paymentMethod" DROP NOT NULL`
    );
    
    // Then drop the column
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" DROP COLUMN "paymentMethod"`
    );
    
    // Drop status column if it exists
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" DROP COLUMN IF EXISTS "status"`
    );
    
    // Drop failedAt column if it exists
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" DROP COLUMN IF EXISTS "failedAt"`
    );
    
    // Drop failureReason column if it exists
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" DROP COLUMN IF EXISTS "failureReason"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Re-add paymentMethod column
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" ADD COLUMN "paymentMethod" character varying`
    );
    
    // Re-add status column
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" ADD COLUMN "status" character varying DEFAULT 'PENDING'`
    );
    
    // Re-add failedAt column
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" ADD COLUMN "failedAt" TIMESTAMP`
    );
    
    // Re-add failureReason column
    await queryRunner.query(
      `ALTER TABLE "payment_transactions" ADD COLUMN "failureReason" character varying`
    );
  }
} 