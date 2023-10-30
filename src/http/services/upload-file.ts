import { uploadToS3 } from '@/lib/S3'

export async function uploadFile(file: Buffer, folderInBucket: string) {
  const s3Path = `${folderInBucket}`
  console.log('====================================');
  console.log(s3Path);
  console.log('====================================');
  return await uploadToS3(file, s3Path)
}
