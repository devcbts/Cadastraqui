import { env } from '@/env';
import Queue from 'bull';
import Redis from 'ioredis';
import { searchCNPJJob } from '../jobs/search-CNPJ-Job';

// Configurar a fila de tarefas
const cnpjQueue = new Queue('cnpjQueue', {
  redis: {
    host: env.REDIS_HOST, // Host do Redis
    port: env.REDIS_PORT, // Porta do Redis
    password: env.REDIS_PASSWORD, // Senha do Redis
  },
});

const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
});

cnpjQueue.on('ready', () => {
  console.log('Conexão com o Redis foi bem-sucedida!');
});

// Função para adicionar tarefas à fila
export async function addCNPJTask(application_id: string) {
  console.log(`Adicionando tarefa de busca para a inscrição: ${application_id}`);
  // await cnpjQueue.add({ application_id });
  const resultado = await searchCNPJJob(application_id);
}

// Processador de tarefas
cnpjQueue.process(async (job, done) => {
  const { application_id } = job.data;
  try {
    // Log de início
    await redisClient.lpush('cnpj_task_logs', `Iniciando busca para o CNPJ ${application_id} em ${new Date().toISOString()}`);
    console.log(`Iniciando busca para o CNPJ ${application_id}`);

    // Realiza a consulta de CNPJ (serviço fictício)

    // Armazena o resultado no Redis

    done();
  } catch (error: any) {
    console.error(`Erro ao processar busca para o CNPJ ${application_id}:`, error);
    await redisClient.lpush('cnpj_task_logs', `Erro ao processar busca para o CNPJ ${application_id} em ${new Date().toISOString()}: ${error.message}`);
    done(error);
  }
});