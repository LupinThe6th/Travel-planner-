/*
  Warnings:

  - You are about to drop the column `tripId` on the `Location` table. All the data in the column will be lost.
  - Added the required column `tripid` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_tripId_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "tripId",
ADD COLUMN     "tripid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_tripid_fkey" FOREIGN KEY ("tripid") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
