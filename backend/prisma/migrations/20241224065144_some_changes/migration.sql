-- DropForeignKey
ALTER TABLE "CodeExecution" DROP CONSTRAINT "CodeExecution_userId_fkey";

-- DropForeignKey
ALTER TABLE "Snippet" DROP CONSTRAINT "Snippet_userId_fkey";

-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeExecution" ADD CONSTRAINT "CodeExecution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
