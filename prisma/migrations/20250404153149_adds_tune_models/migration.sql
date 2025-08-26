-- CreateTable
CREATE TABLE "tune" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT,
    "tempo" SMALLINT NOT NULL,
    "beatsPerMeasure" SMALLINT NOT NULL,
    "beatUnit" SMALLINT NOT NULL,
    "key" VARCHAR(3),
    "color" VARCHAR(7),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measure" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT,
    "number" SMALLINT NOT NULL,
    "repeat_start" BOOLEAN NOT NULL DEFAULT false,
    "repeat_end" BOOLEAN NOT NULL DEFAULT false,
    "repeat_times" SMALLINT,
    "color" VARCHAR(7),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tune_id" UUID NOT NULL,
    CONSTRAINT "measure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT,
    "color" VARCHAR(7),
    "pitch" VARCHAR(3) NOT NULL,
    "start" SMALLINT NOT NULL,
    "duration" SMALLINT NOT NULL,
    "velocity" SMALLINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "measure_id" UUID NOT NULL,
    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE
    "measure"
ADD
    CONSTRAINT "measure_tune_id_fkey" FOREIGN KEY ("tune_id") REFERENCES "tune"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "note"
ADD
    CONSTRAINT "note_measure_id_fkey" FOREIGN KEY ("measure_id") REFERENCES "measure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;