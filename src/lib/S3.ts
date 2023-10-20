import * as AWS from 'aws-sdk'
import * as dotenv from 'dotenv'

dotenv.config()

const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const bucketName = process.env.AWS_BUCKET_NAME

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
})

// Função genérica para upload de arquivo no S3
export async function uploadToS3(filePath: string, fileName: string) {
  const fileData = require('fs').readFileSync(filePath)

  const params = {
    Bucket: bucketName!,
    Body: fileData,
    Key: fileName,
  }

  try {
    const response = await s3.upload(params).promise()
    console.log(`File uploaded successfully at ${response.Location}`)
    return response.Location
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return error
  }
}

// Exemplo de uso:
// uploadToS3('path/to/your/file.jpg', 'desiredNameInS3.jpg');

//Função para baixar o arquivo
export async function downloadFromS3(fileNameInBucket: string, localSavePath: string) {
    const fs = require('fs');
    const params = {
        Bucket: bucketName!,
        Key: fileNameInBucket
    };

    try {
        const fileStream = s3.getObject(params).createReadStream();
        const writeStream = fs.createWriteStream(localSavePath);
        fileStream.pipe(writeStream);

        return new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
            fileStream.on('error', reject);
        });
    } catch (error: any) {
        console.error("Error downloading file:", error);
        throw error;
    }
}

// Função para pegar os links dos arquivos em uma determinada pasta
export async function getSignedUrlsFromUserFolder(userFolder: string): Promise<string[]> {
  const params = {
      Bucket: bucketName!,
      Prefix: userFolder + '/' // Garante que estamos olhando apenas para arquivos dentro da pasta do usuário
  };

  try {
      const objects = await s3.listObjectsV2(params).promise();
      const signedUrls: string[] = [];

      for (const obj of objects.Contents || []) {
          const url = s3.getSignedUrl('getObject', {
              Bucket: process.env.AWS_BUCKET_NAME!,
              Key: obj.Key!,
              Expires: 3600 // O URL será válido por 1 hora
          });
          signedUrls.push(url);
      }

      console.log('====================================');
      console.log(signedUrls);
      console.log('====================================');
      return signedUrls;
  } catch (error: any) {
      console.error("Error fetching signed URLs:", error);
      throw error;
  }
}