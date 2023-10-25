import { uploadToS3 } from '@/lib/S3'

export async function uploadFile(filePath: string, folderInBucket: string) {
  const fileName = filePath.split('/').pop() || 'file'
  const s3Path = `${folderInBucket}/${fileName}`
  return await uploadToS3(filePath, s3Path)
}
