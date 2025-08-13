-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "step" INTEGER NOT NULL,
    "aadhaar" TEXT,
    "nameAadhaar" TEXT,
    "otpMasked" TEXT,
    "pan" TEXT,
    "namePan" TEXT,
    "dob" TEXT,
    "typeOfOrg" TEXT,
    "rawData" JSONB NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
