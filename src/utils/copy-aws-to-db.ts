import * as AWS from 'aws-sdk'
import { env } from 'process'
import { prisma } from '../lib/prisma'
const region = env.AWS_BUCKET_REGION
const accessKeyId = env.AWS_ACCESS_KEY_ID
const secretAccessKey = env.AWS_SECRET_KEY_ID
const bucketName = env.AWS_BUCKET_NAME

const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
})

async function listAllKeys() {
  let isTruncated = true;  // Indica se há mais páginas de resultados
  let continuationToken = null;  // Token para paginação
  let allKeys: any = [];  // Array para armazenar todas as keys
  console.log('bUCKET', bucketName)
  while (isTruncated) {
    let params: any = {
      Bucket: bucketName,
      Prefix: 'CandidateDocuments/',
      ContinuationToken: continuationToken  // Token de continuação para paginação
    };

    try {
      const data = await s3.listObjectsV2(params).promise();

      // Adiciona as chaves (Keys) dos objetos retornados
      for (const item of data.Contents ?? []) {
        const metadata = await s3.headObject({
          Bucket: bucketName!,
          Key: item.Key!
        }).promise();
        allKeys.push({ key: item.Key, metadata: metadata.Metadata, createdAt: metadata.LastModified });  // item.Key é a chave do objeto no bucket

      }


      // Verifica se há mais objetos para listar
      isTruncated = data.IsTruncated ?? false;
      continuationToken = data.NextContinuationToken;  // Atualiza o token para a próxima página

    } catch (err) {
      console.error('Erro ao listar objetos do bucket:', err);
      break;
    }
  }

  return allKeys;  // Retorna todas as chaves
}

listAllKeys().then(async (v: { key: string, metadata: any, createdAt: Date }[]) => {
  for (const x of v) {
    const obj = await prisma.candidateDocuments.findFirst({
      where: { path: x.key }
    })
    // if (obj) {

    // }
    // if (obj && ["registrato", "pix", "statement"].includes(obj.tableName)) {
    //   const { metadata } = await prisma.candidateDocuments.update({
    //     where: {
    //       id: obj.id
    //     },
    //     data: {
    //       metadata: {
    //         date: obj.createdAt
    //       }
    //     }
    //   })
    //   console.log(metadata)
    // }
    // if (!obj) {
    //   const table_infos = x.key.split('/')
    //   const _0 = table_infos.pop()
    //   const [_1, _2, type, ...ids] = table_infos
    //   const tableid = ids.length === 2 ? ids[1] : ids[0]
    //   // console.log(obj.path, 'EXISTS')
    //   let expiresAt = null
    //   if (!!x.metadata.date) {
    //     const [year, month, day] = x.metadata.date.split('T')[0].split('-') as string

<<<<<<< HEAD
    //     const date = new Date(`
    //       ${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00
    //       `.trim())
    //     let deadlineMonths;
    //     switch (type) {
    //       case "statement":
    //         deadlineMonths = 4
    //         break
    //       case "monthly-income":
    //         deadlineMonths = 7
    //         break
    //       default:
    //         deadlineMonths = 1
    //         break
    //     }
    //     const nextMonth = new Date(date.getFullYear(), date.getMonth() + deadlineMonths, 1, 0, 0, 0, 0)
    //     expiresAt = nextMonth
    //   }
    //   console.log('expires at seria', expiresAt, x.metadata.date, type)
    //   await prisma.candidateDocuments.create({
    //     data: {
    //       metadata: x.metadata,
    //       path: x.key,
    //       status: "UPDATED",
    //       tableName: type,
    //       tableId: tableid,
    //       expiresAt,
    //       createdAt: x.createdAt ?? new Date(),
    //     }
    //   })
    // }
=======
        const date = new Date(`
          ${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00
          `.trim())
        let deadlineMonths;
        switch (type) {
          case "statement":
            deadlineMonths = 4
            break
          case "monthly-income":
            deadlineMonths = 7
            break
          default:
            deadlineMonths = 1
            break
        }
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + deadlineMonths, 1, 0, 0, 0, 0)
        expiresAt = nextMonth
      }
      console.log('expires at seria', expiresAt, x.metadata.date, type)
      await prisma.candidateDocuments.create({
        data: {
          metadata: x.metadata,
          path: x.key,
          status: "UPDATED",
          tableName: type,
          tableId: tableid,
          expiresAt,
          createdAt: x.createdAt ?? new Date(),
          memberId: ids[0]
        }
      })
    }
>>>>>>> dev/backend
  }
  console.log(v.length)
})  
