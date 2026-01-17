import path from 'path'
import { buscadorENEM } from '@/lib/enem/enem-service'

export interface EnemScorePayload {
  linguagens: number
  matematica: number
  humanas: number
  natureza: number
  redacao: number
  examYear: number
}

export interface EnemValidationResult {
  isValidated: boolean
  csvPath: string
  outputPath: string
  matchCount: number
  totalLines: number
}

interface ValidateEnemScoreParams {
  enemScore: EnemScorePayload
  candidateName?: string | null
  cpf: string
  csvPathOverride?: string
}

export async function validateEnemScoreOnCsv({
  enemScore,
  candidateName,
  cpf,
  csvPathOverride,
}: ValidateEnemScoreParams): Promise<EnemValidationResult> {
  const csvPath =
    csvPathOverride ||
    process.env.ENEM_CSV_PATH ||
    path.join(process.cwd(), 'enem_pdf_service', 'data', 'amostra_RESULTADOS_2024.csv')

  const notasBusca = {
    linguagens: enemScore.linguagens?.toString() ?? null,
    humanas: enemScore.humanas?.toString() ?? null,
    natureza: enemScore.natureza?.toString() ?? null,
    matematica: enemScore.matematica?.toString() ?? null,
    redacao: enemScore.redacao?.toString() ?? null,
  }

  const nomeAluno = candidateName ?? ''

  const outputPath = path.join(
    process.cwd(),
    'enem_pdf_service',
    'data',
    `resultado_enem_${cpf}.csv`,
  )

  const searchResult = await buscadorENEM.searchCSV(
    csvPath,
    notasBusca,
    nomeAluno,
    cpf,
    outputPath,
  )

  const isValidated = searchResult.matchCount > 0

  return {
    isValidated,
    csvPath,
    outputPath,
    matchCount: searchResult.matchCount,
    totalLines: searchResult.totalLines,
  }
}
