import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrls } from '@/http/services/get-files'
import { getSignedUrlsGroupedByFolder } from '@/lib/S3'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getSectionDocumentsPDF_HDB(
    application_id: string, section: string,
) {





    const Folder = `applicationDocuments/${application_id}/${section}`

    const urls = await getSignedUrlsGroupedByFolder(Folder)
    
   

    return urls


}
