import { getSignedUrlForFile } from "@/lib/S3";

export async function GetUrl(Folder: string): Promise<string> {
    return await getSignedUrlForFile(Folder)
}