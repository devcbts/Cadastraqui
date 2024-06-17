import { AnnouncementNotExists } from '@/errors/announcement-not-exists-error'
import { NotAllowedError } from '@/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { GetUrls } from '@/http/services/get-files'
import { getSignedUrlForFile, getSignedUrlsGroupedByFolder } from '@/lib/S3'
import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getAssistantDocumentsPDF_HDB(
    application_id: string, type: string,
) {





    const File = `assistantDocuments/${application_id}/${type}`

    const urls = await getSignedUrlsGroupedByFolder(File)
    
   

    return urls


}
