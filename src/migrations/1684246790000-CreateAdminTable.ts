import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminTable1684246790000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "admins" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "refreshToken" character varying,
        "isActive" boolean NOT NULL DEFAULT true,
        "role" character varying NOT NULL DEFAULT 'admin',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_e3b38270c97a854c48d2e80874" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_fe4044d7bf02f1dcdca9b8365e5" UNIQUE ("username"),
        CONSTRAINT "UQ_051a7e7e49f46811f716e7a6fb9" UNIQUE ("email")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "admins"`);
  }
} 