import Redis from 'ioredis';
import { runApplicationAnalysis } from '../../scripts/AI_Assistant/run_application_analysis';
import Queue from 'bull';
import { env } from '@/env';


// Configurar a fila de tarefas
const analysisQueue = new Queue('analysisQueue', {
    redis: {

        host: env.REDIS_HOST, // Substitua pelo host do seu Redis na nuvem
        port: env.REDIS_PORT, // Substitua pela porta do seu Redis na nuvem
        password: env.REDIS_PASSWORD // Substitua pela senha do seu Redis na nuvem
    },


});
const redisClient = new Redis({
    host: env.REDIS_HOST, // Substitua pelo host do seu Redis na nuvem
    port: env.REDIS_PORT, // Substitua pela porta do seu Redis na nuvem
    password: env.REDIS_PASSWORD // Substitua pela senha do seu Redis na nuvem
});

analysisQueue.on('ready', () => {
    console.log('Conexão com o Redis foi bem-sucedida!');
});

// Função para adicionar tarefas à fila
export async function addAnalysisTask(application_id: string) {
    console.log("Adicionando tarefa de análise para a aplicação", application_id);
    await analysisQueue.add({ application_id });
}

// Processador de tarefas
analysisQueue.process(async (job, done) => {
    const { application_id } = job.data;
    try {

        await redisClient.lpush('task_logs', `Iniciando análise da aplicação ${application_id} em ${new Date().toISOString()}`);

        console.log(`Iniciando análise da aplicação ${application_id}`);
        await runApplicationAnalysis(application_id);
        done();
    } catch (error: any) {
        console.error(`Erro ao processar análise da aplicação ${application_id}:`, error);
        await redisClient.lpush('task_logs', `Erro ao processar análise da aplicação ${application_id} em ${new Date().toISOString()}: ${error.message}`);
        done(error);
    }
});


