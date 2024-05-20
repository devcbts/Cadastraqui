import { prisma } from "@/lib/prisma";

export default async function getOpenApplications(id: string){
    const findOpenApplications = await prisma.application.findMany({
        where: {
            OR: [{ candidate_id: id }, { responsible_id: id }],
            announcement:{
                closeDate: {gt: new Date()}
            }
        },
    });
    return findOpenApplications;
}