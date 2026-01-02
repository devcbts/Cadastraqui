import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const enemScoreSchema = z.object({
  enemScore: z.object({
    linguagens: z.coerce.number().min(0, 'Mínimo 0').max(1000, 'Máximo 1000'),
    matematica: z.coerce.number().min(0, 'Mínimo 0').max(1000, 'Máximo 1000'),
    humanas: z.coerce.number().min(0, 'Mínimo 0').max(1000, 'Máximo 1000'),
    natureza: z.coerce.number().min(0, 'Mínimo 0').max(1000, 'Máximo 1000'),
    redacao: z.coerce.number().min(0, 'Mínimo 0').max(1000, 'Máximo 1000'),
    examYear: z.coerce.number().int().min(2009, 'Ano mínimo 2009').max(currentYear, `Ano máximo ${currentYear}`),
  }),
})

export default enemScoreSchema
