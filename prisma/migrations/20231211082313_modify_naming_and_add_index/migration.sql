/*
  Warnings:

  - You are about to drop the column `introducer_code` on the `Policyholder` table. All the data in the column will be lost.
  - You are about to drop the column `left_introduced_code` on the `Policyholder` table. All the data in the column will be lost.
  - You are about to drop the column `parent_introduce_code` on the `Policyholder` table. All the data in the column will be lost.
  - You are about to drop the column `registration_date` on the `Policyholder` table. All the data in the column will be lost.
  - You are about to drop the column `right_introduced_code` on the `Policyholder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[leftIntroducedCode]` on the table `Policyholder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rightIntroducedCode]` on the table `Policyholder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registrationDate` to the `Policyholder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Policyholder" DROP CONSTRAINT "Policyholder_introducer_code_fkey";

-- DropForeignKey
ALTER TABLE "Policyholder" DROP CONSTRAINT "Policyholder_left_introduced_code_fkey";

-- DropForeignKey
ALTER TABLE "Policyholder" DROP CONSTRAINT "Policyholder_parent_introduce_code_fkey";

-- DropForeignKey
ALTER TABLE "Policyholder" DROP CONSTRAINT "Policyholder_right_introduced_code_fkey";

-- DropIndex
DROP INDEX "Policyholder_left_introduced_code_key";

-- DropIndex
DROP INDEX "Policyholder_right_introduced_code_key";

-- AlterTable
ALTER TABLE "Policyholder" DROP COLUMN "introducer_code",
DROP COLUMN "left_introduced_code",
DROP COLUMN "parent_introduce_code",
DROP COLUMN "registration_date",
DROP COLUMN "right_introduced_code",
ADD COLUMN     "introducerCode" INTEGER,
ADD COLUMN     "leftIntroducedCode" INTEGER,
ADD COLUMN     "parentIntroducerCode" INTEGER,
ADD COLUMN     "registrationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "rightIntroducedCode" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Policyholder_leftIntroducedCode_key" ON "Policyholder"("leftIntroducedCode");

-- CreateIndex
CREATE UNIQUE INDEX "Policyholder_rightIntroducedCode_key" ON "Policyholder"("rightIntroducedCode");

-- CreateIndex
CREATE INDEX "Policyholder_leftIntroducedCode_rightIntroducedCode_idx" ON "Policyholder"("leftIntroducedCode", "rightIntroducedCode");

-- AddForeignKey
ALTER TABLE "Policyholder" ADD CONSTRAINT "Policyholder_introducerCode_fkey" FOREIGN KEY ("introducerCode") REFERENCES "Policyholder"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policyholder" ADD CONSTRAINT "Policyholder_parentIntroducerCode_fkey" FOREIGN KEY ("parentIntroducerCode") REFERENCES "Policyholder"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policyholder" ADD CONSTRAINT "Policyholder_leftIntroducedCode_fkey" FOREIGN KEY ("leftIntroducedCode") REFERENCES "Policyholder"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policyholder" ADD CONSTRAINT "Policyholder_rightIntroducedCode_fkey" FOREIGN KEY ("rightIntroducedCode") REFERENCES "Policyholder"("code") ON DELETE SET NULL ON UPDATE CASCADE;
