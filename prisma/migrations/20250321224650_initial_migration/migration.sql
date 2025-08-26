-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'teacher', 'student');

-- CreateEnum
CREATE TYPE "note_key" AS ENUM ('c', 'g', 'd', 'a', 'e', 'b', 'f_sharp', 'd_flat', 'a_flat', 'e_flat', 'b_flat', 'f');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT,
    "username" TEXT,
    "birth_date" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'teacher',
    "nickname" TEXT NOT NULL,
    "fullName" TEXT,
    "school" TEXT,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher_invite" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(8) NOT NULL,
    "email" TEXT NOT NULL,
    "view_count" SMALLINT NOT NULL DEFAULT 0,
    "last_viewed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "teacher_invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classroom_student" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "classroom_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" TIMESTAMP(3),

    CONSTRAINT "classroom_student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classroom" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(8) NOT NULL,
    "name" TEXT NOT NULL,
    "year" SMALLINT NOT NULL,
    "description" TEXT,
    "teacher_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" VARCHAR(7) NOT NULL DEFAULT '#f0f0c0',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "note_key" "note_key" DEFAULT 'c',
    "color" VARCHAR(7) NOT NULL DEFAULT '#f0f0c0',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_chapter" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order" SMALLINT NOT NULL,
    "collection_id" UUID NOT NULL,
    "chapter_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order" SMALLINT NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "note_key" "note_key" DEFAULT 'c',
    "color" VARCHAR(7) NOT NULL DEFAULT '#f0f0c0',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chapter_id" UUID NOT NULL,

    CONSTRAINT "page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_sequence" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "root" TEXT,
    "type" TEXT,
    "tempo" SMALLINT NOT NULL,
    "time_signature" VARCHAR(10) NOT NULL,
    "ticks_per_beat" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_sequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sequence_note" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "note_number" SMALLINT NOT NULL,
    "start_time_in_ticks" SMALLINT NOT NULL,
    "duration_in_ticks" SMALLINT NOT NULL,
    "velocity" SMALLINT NOT NULL,
    "noteOffVelocity" SMALLINT,
    "note_sequence_id" UUID NOT NULL,

    CONSTRAINT "sequence_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "midi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "file_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "midi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_note_sequence" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "note_sequence_id" UUID NOT NULL,
    "page_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_note_sequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_midi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "midi_id" UUID NOT NULL,
    "page_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_midi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "page_id" UUID NOT NULL,
    "student_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practice_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_invite_code_key" ON "teacher_invite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "classroom_code_key" ON "classroom"("code");

-- CreateIndex
CREATE UNIQUE INDEX "note_sequence_name_key" ON "note_sequence"("name");

-- AddForeignKey
ALTER TABLE "classroom_student" ADD CONSTRAINT "classroom_student_classroom_id_fkey" FOREIGN KEY ("classroom_id") REFERENCES "classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classroom_student" ADD CONSTRAINT "classroom_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_chapter" ADD CONSTRAINT "collection_chapter_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_chapter" ADD CONSTRAINT "collection_chapter_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page" ADD CONSTRAINT "page_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sequence_note" ADD CONSTRAINT "sequence_note_note_sequence_id_fkey" FOREIGN KEY ("note_sequence_id") REFERENCES "note_sequence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_note_sequence" ADD CONSTRAINT "page_note_sequence_note_sequence_id_fkey" FOREIGN KEY ("note_sequence_id") REFERENCES "note_sequence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_note_sequence" ADD CONSTRAINT "page_note_sequence_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_midi" ADD CONSTRAINT "page_midi_midi_id_fkey" FOREIGN KEY ("midi_id") REFERENCES "midi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_midi" ADD CONSTRAINT "page_midi_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_event" ADD CONSTRAINT "practice_event_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_event" ADD CONSTRAINT "practice_event_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
