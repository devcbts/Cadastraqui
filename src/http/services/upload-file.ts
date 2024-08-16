import { uploadToS3 } from '@/lib/S3'

export async function uploadFile(file: Buffer, folderInBucket: string, metadata: object | undefined = undefined) {
  const s3Path = `${folderInBucket}`
  console.log('====================================')
  console.log(s3Path)
  console.log('====================================')

  return await uploadToS3(file, s3Path, metadata)
}
