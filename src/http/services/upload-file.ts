import { uploadToS3 } from '@/lib/S3'

export async function uploadFile(file: Buffer, folderInBucket: string, metadata: object | undefined = undefined) {
  const s3Path = `${folderInBucket}`
  
  return await uploadToS3(file, s3Path, metadata)
}
