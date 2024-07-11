import { ForbiddenError } from "@/errors/forbidden-error"
import getOpenApplications from "@/HistDatabaseFunctions/find-open-applications"
import { findAWSRouteHDB } from "@/HistDatabaseFunctions/Handle Application/find-AWS-Route"
import { deleteFile } from "@/http/services/delete-file"

// deletes the current AWS file and its history version
export default async function deleteAwsFile(userid: string, path: string) {

    const section = path.split('/')[2]
    const fileName = path.split('/')[-1]
    const memberId = path.split('/')[3]
    let tableId = path.split('/')[4]
    if (fileName === tableId) {
        tableId = ''
    }
    const candidateOrResponsibleId = path.split('/')[1]
    if (candidateOrResponsibleId != userid) {
        throw new ForbiddenError()
    }

    const findOpenApplications = await getOpenApplications(candidateOrResponsibleId)
    await deleteFile(path);
    for (const application of findOpenApplications) {
        const routeHDB = await findAWSRouteHDB(userid, section, memberId, tableId, application.id);
        const finalRoute = `${routeHDB}${fileName}`;
        await deleteFile(finalRoute)

    }
    return true
}