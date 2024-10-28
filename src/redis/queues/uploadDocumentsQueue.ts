import Queue from 'bull';
import Redis from 'ioredis';
// Exportar a fila de tarefas e o cliente Redis
import { uploadFile } from '@/http/services/upload-file';
import { prisma, historyDatabase } from '@/lib/prisma';
import { createCandidateDocumentHDB } from '@/HistDatabaseFunctions/Handle Documents/handle-candidate-document';
import { findAWSRouteHDB, findTableHDBId } from '@/HistDatabaseFunctions/Handle Application/find-AWS-Route';
import getOpenApplications from '@/HistDatabaseFunctions/find-open-applications';
import { copyFilesToAnotherFolder, copySingleFileToAnotherFolder } from '@/lib/S3';
import { env } from '@/env';

// Configurar a fila de tarefas
export const uploadQueue = new Queue('uploadQueue', {
    redis: {
        host: env.REDIS_HOST, // Substitua pelo host do seu Redis na nuvem
        port: env.REDIS_PORT, // Substitua pela porta do seu Redis na nuvem
        password: env.REDIS_PASSWORD // Substitua pela senha do seu Redis na nuvem
    }
});

// Configurar o cliente Redis para logs
export const redisClient = new Redis({
    host: env.REDIS_HOST, // Substitua pelo host do seu Redis na nuvem
    port: env.REDIS_PORT, // Substitua pela porta do seu Redis na nuvem
    password: env.REDIS_PASSWORD // Substitua pela senha do seu Redis na nuvem
});

uploadQueue.on('ready', () => {
    console.log('Conexão com o Redis foi bem-sucedida!');
});

uploadQueue.on('error', (error) => {
    console.error('Erro na conexão com o Redis:', error);
});


uploadQueue.process(async (job, done) => {
    const { route, fileBuffer, metadata, documentType, table_id, member_id, user_id } = job.data;
    try {
        // Inicia transação de envio de documento

        console.log(`Iniciando upload do arquivo ${route}`);
        const findOpenApplications = await getOpenApplications(user_id);
        for (const application of findOpenApplications) {
            try {

                console.log(`Iniciando upload do arquivo ${route} para a aplicação ${application.id}`);
                await historyDatabase.$transaction(async (tsBackupPrisma) => {
                    const routeHDB = await findAWSRouteHDB(user_id, documentType, member_id, table_id, application.id);
                    const tableIdHDB = await findTableHDBId(documentType, member_id, table_id, application.id);
                    const finalRoute = `${routeHDB}${route.split('/').pop()}`;
                    await createCandidateDocumentHDB(tsBackupPrisma, finalRoute, route, metadata, documentType, tableIdHDB, application.id);
                    await copySingleFileToAnotherFolder(route, finalRoute);

                }, {
                    timeout: 10000
                });
            } catch (error: any) {
                console.error(`Erro ao processar upload do arquivo ${route} para a aplicação ${application.id}:`, error);
                await redisClient.lpush('task_logs', `Erro ao processar upload do arquivo ${route} para a aplicação ${application.id} em ${new Date().toISOString()}: ${error.message}`);
                done(error);
            }
        }




        // Log de finalização
        await redisClient.lpush('task_logs', `Finalizando upload do arquivo ${route} em ${new Date().toISOString()}`);
        console.log(`Finalizando upload do arquivo ${route}`);

        done();
    } catch (error: any) {
        console.error(`Erro ao processar o upload do arquivo ${route}:`, error);
        await redisClient.lpush('task_logs', `Erro ao processar o upload do arquivo ${route} em ${new Date().toISOString()}: ${error.message}`);
        done(error);
    }
});