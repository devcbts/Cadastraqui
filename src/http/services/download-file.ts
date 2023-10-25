import { downloadFromS3 } from "@/lib/S3";

export async function downloadFile(fileNameInBucket: string, localSavePath: string): Promise<void> {
    await downloadFromS3(fileNameInBucket, localSavePath);
}