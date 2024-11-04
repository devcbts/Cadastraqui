import 'dotenv/config'
import { z } from 'zod'
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_BUCKET_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_KEY_ID: z.string(),
  CPF_CNPJ_KEY: z.string(),
  MAPS_KEY: z.string(),
  PLUGSIGN_API_KEY: z.string(),
  PORTAL_TRANSPARENCIA_KEY: z.string(),
  REDIS_HOST: z.string(), // Substitua pelo host do seu Redis na nuvem
  REDIS_PORT: z.number(), // Substitua pela porta do seu Redis na nuvem
  REDIS_PASSWORD: z.string()
})
// Validação das variáveis de ambiente
const _env = envSchema.safeParse(process.env)
if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
