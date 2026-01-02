import { prisma } from "@/lib/prisma";

// Recalculate and update Application.enemScore for a candidate
export async function updateEnemScoreForCandidate(candidateId: string) {
  if (!candidateId) return;

  const score = await prisma.enemScore.findUnique({
    where: { candidate_id: candidateId },
    select: {
      linguagens: true,
      matematica: true,
      humanas: true,
      natureza: true,
      redacao: true,
    },
  });

  if (!score) return;

  const composite = (score.linguagens + score.matematica + score.humanas + score.natureza + score.redacao) / 5;

  await prisma.application.updateMany({
    where: {
      candidate_id: candidateId,
      announcement:{
        announcementDate: {
            gte: new Date()
        }
      }
    },
    data: {
      enemScore: composite,
      updatedAt: new Date(),
    },
  });
}
