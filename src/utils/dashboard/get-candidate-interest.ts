import { prisma } from "@/lib/prisma";
import { Announcement } from "@prisma/client";

export default async function getCandidateInterestForDashboard(announcements: Announcement[]) {
    // Retrieve all announcement IDs associated with the entity


    const announcement_ids = announcements.map((a) => a.id);

    // Fetch all interests for those announcements
    const allInterest = await prisma.announcementsSeen.findMany({
        where: { announcement_id: { in: announcement_ids } },
        include: {
            candidate: {
                include: {
                    FinishedRegistration: true,

                },
            },
            responsible: {
                include: {
                    FinishedRegistration: true,


                },
            },
        },
    });

    // Fetch all applications for those announcements
    const applications = await prisma.application.findMany({
        where: { announcement_id: { in: announcement_ids } },
        select: {
            responsible_id: true,
            candidate_id: true,
        },
    });

    const numberOfInterested = allInterest.length;
    let numberOfFinishedRegistration = 0;

    for (const userInterest of allInterest) {
        const candidateInfo = userInterest.candidate || userInterest.responsible;
        const completions = candidateInfo?.FinishedRegistration;
        if (!completions) {
            continue;
        }
        // Check if all properties are true
        const allCompleted =
            completions.cadastrante &&
            completions.grupoFamiliar &&
            completions.moradia &&
            completions.veiculos &&
            completions.rendaMensal &&
            completions.despesas &&
            completions.saude &&
            completions.declaracoes &&
            completions.documentos;

        if (allCompleted) {
            numberOfFinishedRegistration++;
        }




        ;
    }
    // Group by announcement_id
    const distributionByAnnouncement = announcement_ids.map((announcement_id) => {
        const interests = allInterest.filter(interest => interest.announcement_id === announcement_id);
        const numberOfInterested = interests.length;


        return {
            announcement_id,
            numberOfInterested
        };
    });


    return {
        totalNumberOfInterested: numberOfInterested,
        numberOfApplications: applications.length,
        numberOfFinishedRegistration,
        numberOfUnfinishedRegistration:
            numberOfInterested - numberOfFinishedRegistration,
        distributionByAnnouncement
    };
}