import dotenv from 'dotenv'
import 'dotenv/config'
import path from 'path'
import { z } from 'zod'
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_BUCKET_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_KEY_ID: z.string(),
})
// Validação das variáveis de ambiente
const _env = envSchema.safeParse(dotenv.config({ path: path.resolve(__dirname, '../../', `.env.${process.env.NODE_ENV}`) }).parsed)
console.log(_env)
if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
