import { getSignedUrlsGroupedByFolder } from '@/lib/S3'

export async function getSectionDocumentsPDF(
    candidateOrResponsible_id: string, section: string
) {





    const Folder = `CandidateDocuments/${candidateOrResponsible_id}/${section}`
    const urls = await getSignedUrlsGroupedByFolder(Folder)



    return urls


}
