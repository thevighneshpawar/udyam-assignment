-- CreateTable
CREATE TABLE "public"."udyam_submissions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aadhaarNumber" VARCHAR(12),
    "entrepreneurName" VARCHAR(100),
    "aadhaarConsent" BOOLEAN NOT NULL DEFAULT false,
    "otpCode" VARCHAR(6),
    "aadhaarVerified" BOOLEAN NOT NULL DEFAULT false,
    "organizationType" VARCHAR(50),
    "panNumber" VARCHAR(10),
    "panHolderName" VARCHAR(100),
    "dobOrDoi" VARCHAR(20),
    "panConsent" BOOLEAN NOT NULL DEFAULT false,
    "panVerified" BOOLEAN NOT NULL DEFAULT false,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "submissionData" JSONB,
    "validationErrors" JSONB,

    CONSTRAINT "udyam_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."form_fields" (
    "id" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "elementType" VARCHAR(50) NOT NULL,
    "fieldType" VARCHAR(50) NOT NULL,
    "fieldId" VARCHAR(100) NOT NULL,
    "fieldName" VARCHAR(100),
    "label" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "placeholder" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "maxLength" INTEGER,
    "minLength" INTEGER,
    "pattern" TEXT,
    "options" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "form_fields_step_fieldId_key" ON "public"."form_fields"("step", "fieldId");
