import { getSignedUrlsFromUserFolder } from "@/lib/S3";

export async function GetUrls(Folder: string): Promise<string[]> {
    return await getSignedUrlsFromUserFolder(Folder)
}