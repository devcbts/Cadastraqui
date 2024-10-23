import { getSectionDocumentsPDF_HDB } from "@/http/controllers/social-assistant/AWS-routes/get-documents-by-section-HDB";

export const getDocumentsUrls = async (sections: string[], application_id: string) => {
    const documentsPromises = sections.map(section =>
        getSectionDocumentsPDF_HDB(application_id, section).then(document => ({ [section]: document }))
    );
    return Promise.all(documentsPromises);
};