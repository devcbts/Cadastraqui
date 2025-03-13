import { env } from '@/env'
import * as AWS from 'aws-sdk'
import { PutObjectRequest } from 'aws-sdk/clients/s3'

const region = env.AWS_BUCKET_REGION
const accessKeyId = env.AWS_ACCESS_KEY_ID
const secretAccessKey = env.AWS_SECRET_KEY_ID
const bucketName = env.AWS_BUCKET_NAME

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
})
// Função genérica para upload de arquivo no S3
export async function uploadToS3(fileInfo: Buffer, fileName: string, metadata: object = {}) {
  const params: PutObjectRequest = {
    Bucket: bucketName!,
    Body: fileInfo,
    Key: fileName,
    Metadata: { ...metadata }
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

// Função para baixar o arquivo
export async function downloadFromS3(
  fileNameInBucket: string,
  localSavePath: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs')
  const params = {
    Bucket: bucketName!,
    Key: fileNameInBucket,
  }

  try {
    const fileStream = s3.getObject(params).createReadStream()
    const writeStream = fs.createWriteStream(localSavePath)
    fileStream.pipe(writeStream)

    return new Promise((resolve, reject) => {
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
      fileStream.on('error', reject)
    })
  } catch (error: any) {
    console.error('Error downloading file:', error)
    throw error
  }
}
export async function getAwsFileFromFolder(
  folder: string
) {
  const params = {
    Bucket: bucketName!,
    Prefix: folder + `/`, // Ajustado para a pasta do candidato
  }
  try {
    const objects = await s3.listObjectsV2(params).promise()
    const response: {
      fileKey: string,
      fileUrl: string,
      fileName: string,
      fileMetadata: any
    }[] = []
    // const urlsByFolder: { [folder: string]: { [fileName: string]: string } } = {}
    for (const obj of objects.Contents || []) {
      if (!obj.Key!.endsWith('/')) { // Ignora 'pastas'
        const splitKey = obj.Key!.split('/');
        const folderPath = splitKey.slice(0, -1).join('/') // Remove o nome do arquivo para obter o caminho da pasta
        const fileName = "url_" + splitKey[splitKey.length - 1]; // Get the file name
        const url = s3.getSignedUrl('getObject', {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: obj.Key!,
          Expires: 3600, // O URL será válido por 1 hora
        })
        const metadata = (await s3.headObject({ Key: obj.Key!, Bucket: process.env.AWS_BUCKET_NAME! }).promise()).Metadata
        response.push({
          fileKey: obj.Key!,
          fileMetadata: metadata,
          fileUrl: url,
          fileName: fileName
        })
      }
    }

    return response
  } catch (error: any) {
    console.error('Error fetching signed URLs:', error)
    throw error
  }

}
// Função para pegar os links dos arquivos em uma determinada pasta
export async function getSignedUrlsFromUserFolder(
  userFolder: string,
): Promise<string[]> {
  const params = {
    Bucket: bucketName!,
    Prefix: userFolder + '/', // Garante que estamos olhando apenas para arquivos dentro da pasta do usuário
  }

  try {
    const objects = await s3.listObjectsV2(params).promise()
    const signedUrls: string[] = []

    for (const obj of objects.Contents || []) {
      const url = s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: obj.Key!,
        Expires: 3600, // O URL será válido por 1 hora
      })
      signedUrls.push(url)
    }

    return signedUrls
  } catch (error: any) {
    console.error('Error fetching signed URLs:', error)
    throw error
  }
}

export async function getSignedUrlForFile(fileKey: string): Promise<string> {
  try {
    let signedUrl;
    // Search object first, if does not exist, do not return an URL
    const fileExists = await s3.headObject({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
    }).promise()
    if (fileExists.$response.error) {
      signedUrl = null;
    }
    signedUrl = s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
      Expires: 100000, // O URL será válido por 1 hora
    })
    console.log('cheguei aqi')
    console.log(signedUrl)
    return signedUrl
  } catch (error: any) {
    console.error('Error fetching signed URL:', error)
    return ''
    // throw error
  }
}
export async function getSignedUrlsGroupedByFolder(
  candidateFolder: string,
): Promise<{ [folder: string]: { [fileName: string]: string } }> {
  const params = {
    Bucket: bucketName!,
    Prefix: candidateFolder + `/`, // Ajustado para a pasta do candidato
  }
  try {
    const objects = await s3.listObjectsV2(params).promise()
    const urlsByFolder: { [folder: string]: { [fileName: string]: string } } = {}
    for (const obj of objects.Contents || []) {
      if (!obj.Key!.endsWith('/')) { // Ignora 'pastas'
        const splitKey = obj.Key!.split('/');
        const folderPath = splitKey.slice(0, -1).join('/') // Remove o nome do arquivo para obter o caminho da pasta
        const fileName = "url_" + splitKey[splitKey.length - 1]; // Get the file name
        const url = s3.getSignedUrl('getObject', {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: obj.Key!,
          Expires: 3600, // O URL será válido por 1 hora
        })
        if (!urlsByFolder[folderPath]) {
          urlsByFolder[folderPath] = {}
        }
        urlsByFolder[folderPath][fileName] = url
      }
    }

    return urlsByFolder
  } catch (error: any) {
    console.error('Error fetching signed URLs:', error)
    throw error
  }
}
export async function deleteFromS3(fileKey: string) {
  const params = {
    Bucket: bucketName!,
    Key: fileKey,
  };

  try {
    const response = await s3.deleteObject(params).promise();
    return response;
  } catch (error: any) {
    console.log(error)
    throw error;
  }
}
export async function deleteFromS3Folder(folderKey: string) {
  const listParams = {
    Bucket: bucketName!,
    Prefix: folderKey, // Assuming folderKey ends with a '/'
  };
  console.log(folderKey)
  try {

    const listedObjects = await s3.listObjectsV2(listParams).promise();
    if (!listedObjects.Contents) return
    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
      Bucket: bucketName!,
      Delete: {
        Objects: listedObjects.Contents.map(({ Key }) => ({ Key: Key! })),
      },
    };

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await deleteFromS3Folder(folderKey); // Recursively delete if the folder is large
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function copyFilesToAnotherFolder(sourceFolder: string, destinationFolder: string) {
  try {
    console.log(sourceFolder, destinationFolder)
    const { Contents } = await s3.listObjectsV2({ Bucket: bucketName!, Prefix: sourceFolder }).promise();
    console.log(`Contents of source folder: ${JSON.stringify(Contents)}`)
    for (const content of Contents || []) {
      if (content.Key) {
        const copySource = `${bucketName}/${content.Key}`;
        const destinationKey = content.Key.replace(sourceFolder, destinationFolder);
        console.log(`Copying file from ${copySource} to ${destinationKey}`);

        await s3.copyObject({
          CopySource: copySource,
          Bucket: bucketName!,
          Key: destinationKey,
          MetadataDirective: 'COPY'
        }).promise();
      }
    }

    console.log('All files copied successfully');
  } catch (error: any) {
    console.error('Error copying files:', error);
    throw error;
  }
}


export async function copySingleFileToAnotherFolder(sourceFilePath: string, destinationFilePath: string) {
  try {
    console.log(`Copying file from ${sourceFilePath} to ${destinationFilePath}`);

    const copySource = `${bucketName}/${sourceFilePath}`;

    await s3.copyObject({
      CopySource: copySource,
      Bucket: bucketName!,
      Key: destinationFilePath,
      MetadataDirective: 'COPY'
    }).promise();

    console.log('File copied successfully');
  } catch (error: any) {
    console.error('Error copying file:', error);
    throw error;
  }
}

export async function getAwsFile(
  path: string
) {
  try {
    const params = {
      Bucket: bucketName!,
      Key: path, // Ajustado para a pasta do candidato
      Expires: 3600
    }
    const file = await s3.getSignedUrlPromise("getObject", params)
    // const response: {
    //   // fileKey: string,
    //   fileUrl: string,
    //   // fileName: string,
    //   // fileMetadata: any
    // }[] = []
    return {
      fileUrl: file
    }
  } catch (error) {
    throw error;

  }
}