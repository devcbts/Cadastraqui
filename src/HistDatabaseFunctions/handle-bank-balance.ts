import { historyDatabase, prisma } from "@/lib/prisma";
import getOpenApplications from "./find-open-applications";
import { findAWSRouteHDB } from "./Handle Application/find-AWS-Route";
import { copyFilesToAnotherFolder, deleteFromS3Folder } from "@/lib/S3";
import getCandidateDocument from "@/http/controllers/candidates/Documents Functions/get-candidate-document";
import { createCandidateDocumentHDB } from "./Handle Documents/handle-candidate-document";

export async function createBankBalanceHDB(id: string, application_id: string) {
  const bankBalance = await prisma.bankBalance.findUnique({
    where: { id },
    include: { bankAccount: true },
  });
  if (!bankBalance) {
    return null;
  }
  const { id: oldId, bankAccount_id: oldBankAccountId, bankAccount,...bankBalanceData } = bankBalance;
  const bankAccountMapping = await historyDatabase.bankAccount.findFirst({
    where: { main_id: oldBankAccountId, application_id },
  });
  if (!bankAccountMapping) {
    return null;
  }
  const newBankAccountId = bankAccountMapping.id;
  await historyDatabase.bankBalance.create({
    data: {
      main_id: id,
      ...bankBalanceData,
      bankAccount_id: newBankAccountId,
      application_id,
    },
  });
  const candidateOrResponsibleId =
    bankBalance.bankAccount.candidate_id ||
    bankBalance.bankAccount.legalResponsibleId ||
    bankBalance.bankAccount.familyMember_id;
  if (!candidateOrResponsibleId) {
    return null;
  }
 
}

export async function updateBankBalanceHDB(id: string) {
  const bankBalance = await prisma.bankBalance.findUnique({
    where: { id },
    include: { bankAccount: { include: { familyMember: true } } },
  });
  if (!bankBalance) {
    return null;
  }
  const { id: oldId, bankAccount_id: oldBankAccountId, ...bankBalanceData } = bankBalance;
  const bankAccount = bankBalance.bankAccount;
  const candidateOrResponsible =
    bankAccount.candidate_id ||
    bankAccount.familyMember?.candidate_id ||
    bankAccount.legalResponsibleId ||
    bankAccount.familyMember?.legalResponsibleId;
  if (!candidateOrResponsible) {
    return null;
  }
  const openApplications = await getOpenApplications(candidateOrResponsible);
  if (!openApplications) {
    return null;
  }
  for (const application of openApplications) {
    
    await historyDatabase.bankBalance.updateMany({
      where: { main_id: id, application_id: application.id },
      data: {
        ...bankBalanceData,
      },
    });
  }
}

export async function deleteBankBalanceHDB(id: string) {
  const bankBalance = await prisma.bankBalance.findUnique({
    where: { id },
    include: { bankAccount: true },
  });
  if (!bankBalance) {
    return null;
  }
  const bankAccount = bankBalance.bankAccount;
  const candidateOrResponsibleId =
    bankAccount.candidate_id || bankAccount.legalResponsibleId || bankAccount.familyMember_id;
  if (!candidateOrResponsibleId) {
    return null;
  }
  const openApplications = await getOpenApplications(candidateOrResponsibleId);
  if (!openApplications) {
    return null;
  }
  for (const application of openApplications) {
  
    await historyDatabase.bankBalance.deleteMany({
      where: { main_id: id, application_id: application.id },
    });
   
}
}