-- CreateTable
CREATE TABLE "Policyholder" (
    "code" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL,
    "path" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "introducer_code" INTEGER,
    "parent_introduce_code" INTEGER,
    "left_introduced_code" INTEGER,
    "right_introduced_code" INTEGER,

    CONSTRAINT "Policyholder_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "Policyholder_left_introduced_code_key" ON "Policyholder"("left_introduced_code");

-- CreateIndex
CREATE UNIQUE INDEX "Policyholder_right_introduced_code_key" ON "Policyholder"("right_introduced_code");

-- AddForeignKey
ALTER TABLE "Policyholder" ADD CONSTRAINT "Policyholder_introducer_code_fkey" FOREIGN KEY ("introducer_code") REFERENCES "Policyholder"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policyholder" ADD CONSTRAINT "Policyholder_parent_introduce_code_fkey" FOREIGN KEY ("parent_introduce_code") REFERENCES "Policyholder"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policyholder" ADD CONSTRAINT "Policyholder_left_introduced_code_fkey" FOREIGN KEY ("left_introduced_code") REFERENCES "Policyholder"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policyholder" ADD CONSTRAINT "Policyholder_right_introduced_code_fkey" FOREIGN KEY ("right_introduced_code") REFERENCES "Policyholder"("code") ON DELETE SET NULL ON UPDATE CASCADE;
