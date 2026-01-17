import { historyDatabase, prisma } from '@/lib/prisma';
import getOpenApplications from './find-open-applications';

// Create or update EnemScore snapshots in the history database for all open applications
async function syncEnemScoreHDB(enemScoreId: string, candidateId: string) {
  if (!enemScoreId || !candidateId) return null;

  const enem = await prisma.enemScore.findUnique({
    where: { id: enemScoreId },
  });

  // If the score no longer exists in main DB, just delete from history
  if (!enem) {
    return deleteEnemScoreHDB(enemScoreId, candidateId);
  }

  const openApplications = await getOpenApplications(candidateId);
  if (!openApplications || openApplications.length === 0) {
    return null;
  }

  for (const application of openApplications) {
    const mapping = await historyDatabase.idMapping.findFirst({
      where: { mainId: candidateId, application_id: application.id },
    });

    if (!mapping) {
      continue;
    }

    const backupCandidateId = mapping.newId;

    const existing = await historyDatabase.enemScore.findFirst({
      where: {
        main_id: enemScoreId,
        application_id: application.id,
      },
    });

    if (existing) {
      await historyDatabase.enemScore.update({
        where: { id: existing.id },
        data: {
          linguagens: enem.linguagens,
          matematica: enem.matematica,
          humanas: enem.humanas,
          natureza: enem.natureza,
          redacao: enem.redacao,
          examYear: enem.examYear,
          isValidated: enem.isValidated,
          updatedAt: new Date(),
        },
      });
    } else {
      await historyDatabase.enemScore.create({
        data: {
          main_id: enemScoreId,
          linguagens: enem.linguagens,
          matematica: enem.matematica,
          humanas: enem.humanas,
          natureza: enem.natureza,
          redacao: enem.redacao,
          examYear: enem.examYear,
          isValidated: enem.isValidated,
          candidate_id: backupCandidateId,
          application_id: application.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  return null;
}

export async function createEnemScoreHDB(id: string, candidateId: string) {
  return syncEnemScoreHDB(id, candidateId);
}

export async function updateEnemScoreHDB(id: string, candidateId: string) {
  return syncEnemScoreHDB(id, candidateId);
}

export async function deleteEnemScoreHDB(id: string, candidateId: string) {
  if (!id || !candidateId) return null;

  const openApplications = await getOpenApplications(candidateId);
  if (!openApplications || openApplications.length === 0) {
    return null;
  }

  for (const application of openApplications) {
    await historyDatabase.enemScore.deleteMany({
      where: {
        main_id: id,
        application_id: application.id,
      },
    });
  }

  return null;
}
