import { deleteFromS3 } from "@/lib/S3";

export async function deleteFile(fileNameInBucket: string): Promise<void> {
    await deleteFromS3(fileNameInBucket);
}