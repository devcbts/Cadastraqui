import { AIAssistant } from "@prisma/client";

export default async function detectAnalysisReliability(analysisAI: AIAssistant[]) {
  const percentage = Math.ceil((analysisAI.filter(analysis => analysis.status === 'CONCLUSIVE').length / analysisAI.length) * 100)
  const numberOfInconsistences = analysisAI.reduce((acc: number, analysis) => {
    acc += analysis.inconsistences;
    return acc
  }, 0);
  let status: string;
  if (percentage >= 80 && numberOfInconsistences === 0) {
    status = 'Confiável';
  } else if (percentage >= 50 && percentage < 80 && numberOfInconsistences <= 1) {
    status = 'Pouco Confiável';
  } else  {
    status = 'Não Confiável';
  }

  return {status, percentage, numberOfInconsistences}
}