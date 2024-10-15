import * as AWS from 'aws-sdk'
import { env } from 'process'
import { historyDatabase } from '../lib/prisma'
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
            Prefix: 'applicationDocuments/',
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
    let count = 0;
    let currTable;
    for (const x of v) {
        const tableNames = [
            "idMapping",
            "responsibles",
            "EntitySubsidiary",
            "assistants",
            "entities",
            "users",
            "IdentityDetails",
            "housing",
            "FamilyMemberIncome",
            "familyMemberDiseases",
            "medications",
            "Financing",
            "Declarations",
            "OtherExpense",
            "EducationLevel",
            "Announcement",
            "Application",
            "candidates",
            "familyMembers",
            "Expense",
            "MonthlyIncome",
            "Vehicle",
            "BankAccount",
        ];

        const obj = await historyDatabase.candidateDocuments.findFirst({
            where: { path: x.key }
        })
        if (!obj) {
            const table_infos = x.key.split('/')
            const filename = table_infos.pop()
            const [_1, application_id, type, ...ids] = table_infos
            const tableid = ids.length === 2 ? ids[1] : ids[0]
            let candidate_id;
            let firstId: string = "", sndId: string = ""
            for (const b of tableNames) {
                currTable = b
                let id = b === "idMapping" ? "newId" : "id"

                try {
                    candidate_id = await historyDatabase.idMapping.findFirst({
                        where: { application_id }
                    })
                    // console.log(tableid, currTable)
                    const idOne: any[] = await historyDatabase.$queryRawUnsafe(`
                        SELECT * FROM ${`"${b}"`} WHERE ${`"${id}"`} = $1;
                        `, tableid)
                    let idTwo: any[] = []
                    if (ids.length === 2) {

                        idTwo = await historyDatabase.$queryRawUnsafe(`
                                SELECT * FROM "idMapping" WHERE "newId" = $1;
                                `, ids[0])
                    }
                    // console.log(idOne, 'ID 1', idTwo, 'ID 2')
                    if (idOne.length) {
                        const mainId = b === "idMapping" ? "mainId" : "main_id"
                        firstId = idOne[0][mainId]
                        // if (idTwo.length) {
                        //     sndId = idTwo[0]?.["mainId"]

                        // }
                        // console.log('MAPEANDO O ID', tableid, 'PARA O ID', idOne[0][mainId])
                        // console.log('modelo', model)
                        count++;
                    }
                } catch (err) {
                    console.log('err', err, currTable)
                }
            }
            // console.log(await historyDatabase.idMapping.findFirst({
            //     where: { newId: ids[0] }
            // }))
            // continue;

            // console.log(application_id, tableid, type)
            // }
            // if (!obj) {
            //   const table_infos = x.key.split('/')
            //   const _0 = table_infos.pop()
            // const [_1, application_id, type, ...ids] = table_infos
            //   const tableid = ids.length === 2 ? ids[1] : ids[0]
            // console.log(obj.path, 'EXISTS')
            // let expiresAt = null
            // if (!!x.metadata.date) {
            //     const [year, month, day] = x.metadata.date.split('T')[0].split('-') as string

            //     const date = new Date(`
            //       ${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00
            //       `.trim())
            //     let deadlineMonths;
            //     switch (type) {
            //         case "statement":
            //             deadlineMonths = 4
            //             break
            //         case "monthly-income":
            //             deadlineMonths = 7
            //             break
            //         default:
            //             deadlineMonths = 1
            //             break
            //     }
            //     const nextMonth = new Date(date.getFullYear(), date.getMonth() + deadlineMonths, 1, 0, 0, 0, 0)
            //     expiresAt = nextMonth
            // }
            // console.log('expires at seria', expiresAt, x.metadata.date, type)
            console.log(sndId.length, !!sndId, firstId)
            const suffix = !!sndId ? `${firstId}/${sndId}` : firstId
            await historyDatabase.candidateDocuments.create({
                data: {
                    metadata: x.metadata,
                    path: x.key,
                    pathInMainDatabase: `CandidateDocuments/${candidate_id?.mainId}/${type}/${suffix}/${filename}`,
                    application_id,
                    status: "UPDATED",
                    tableName: type,
                    tableId: tableid,
                    // expiresAt,
                    createdAt: x.createdAt ?? new Date(),
                }
            })
        }
    }
})

// console.log(count, v.length)

// "2034deb7-9eae-414a-80f2-aab9ed70ed09"	"UPDATED"	"applicationDocuments/4af8d977-aa7e-41af-ba86-6f8a85dbdb1f/monthly-income/5295c9d1-172f-4b7c-b200-5d159ce729e3/030eab42-cbc1-4d8c-a7bf-5bfbed6c691c/rendimentos-6-2024.pdf"	"CandidateDocuments/58812d42-b7aa-4644-b072-c61135a3ae03/monthly-income/b66e6c3c-3286-4716-9baf-f436ea9e4c89/a462afcb-a5d0-4f08-8a92-0a9111d3002f/rendimentos-6-2024.pdf"	"{""date"": ""2024-06-01T00:00:00"", ""type"": ""INCOMEPROOF"", ""source"": ""SelfEmployed"", ""category"": ""Finance""}"	"monthly-income"	"030eab42-cbc1-4d8c-a7bf-5bfbed6c691c"	"4af8d977-aa7e-41af-ba86-6f8a85dbdb1f"		"2024-10-11 19:49:43.326"	"2024-10-11 19:49:43.326"
