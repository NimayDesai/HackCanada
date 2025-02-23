-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ingredients" TEXT[],
    "keywords" TEXT[],
    "instructions" TEXT NOT NULL,
    "image_uri" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
