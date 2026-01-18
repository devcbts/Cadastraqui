import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const enemScoreSchema = z.object({
  hasEnemLastYear: z.boolean().nullish(),
  enemScore: z.object({
    linguagens: z.coerce.number().min(0, 'Mínimo 0').max(1000, 'Máximo 1000'),
    matematica: z.coerce.number().min(0, 'Mínimo 0').max(1000, 'Máximo 1000'),
    humanas: z.coerce.number().min(0, 'Mínimo 0').max(1000, 'Máximo 1000'),
    natureza: z.coerce.number().min(0, 'Mínimo 0').max(1000, 'Máximo 1000'),
    redacao: z.coerce.number().min(0, 'Mínimo 0').max(1000, 'Máximo 1000'),
    examYear: z.coerce.number().int().min(2009, 'Ano mínimo 2009').max(currentYear, `Ano máximo ${currentYear}`),
  }).partial(),
}).superRefine((v, ctx) => {
  if (v.hasEnemLastYear) {
    const fields = ['linguagens', 'matematica', 'humanas', 'natureza', 'redacao', 'examYear']
    fields.forEach((field) => {
      if (v.enemScore?.[field] === undefined || v.enemScore?.[field] === null || v.enemScore?.[field] === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['enemScore', field],
          message: 'Campo obrigatório',
        })
      }
    })
  }
})

export default enemScoreSchema
