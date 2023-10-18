import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const bucketName = process.env.AWS_BUCKET_NAME

const s3 = new AWS.S3({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});


export async function uploadToS3(filePath: string, fileName: string) {
    const fileData = require('fs').readFileSync(filePath);

    const params = {
        Bucket: bucketName!,
        Body: fileData,
        Key: fileName
    }



    try {

        const response = await s3.upload(params).promise();
        console.log(`File uploaded successfully at ${response.Location}`);
        return response.Location;

    } catch (error : any) {
        console.error("Error uploading file:", error);
        return error
    }
}

// Exemplo de uso:
// uploadToS3('path/to/your/file.jpg', 'desiredNameInS3.jpg');
