import { AIAssistant } from "@prisma/client";

export default async function detectAnalysisReliability(analysisAI: AIAssistant[]) {
  let percentage = Math.ceil((analysisAI.filter(analysis => analysis.status === 'CONCLUSIVE').length / analysisAI.length) * 100)
  const numberOfInconsistences = analysisAI.reduce((acc: number, analysis) => {
    acc += analysis.inconsistences;
    return acc
  }, 0);
  let status: string;
  if (isNaN(percentage)) {
    percentage = 0
  }
  if (percentage >= 80 && numberOfInconsistences === 0) {
    status = "RELIABLE";
  } else if (percentage >= 50 && percentage < 80 && numberOfInconsistences <= 1) {
    status = "LESS_RELIABLE";
  } else {
    status = "UNRELIABLE";
  }

  return { status, percentage, numberOfInconsistences }
}