import { ENTITY_GROUP_TYPE } from "utils/enums/entity-group-document-type";
import { z } from "zod";

export const cebasSchema = (type) => z.object({
    education: z.instanceof(File).nullish(),
    notes_copy: z.instanceof(File).nullish(),
    certificate: z.object({
        file: z.instanceof(File).nullish(),
        expireAt: z.string().nullish(),
        issuedAt: z.string().nullish(),
    }),
    deadline: z.object({
        file: z.instanceof(File).nullish(),
        issuedAt: z.string().nullish(),
    })
}).partial().superRefine((data, ctx) => {
    console.log('context', type)
    if (type === undefined) {
        if (!data.certificate?.file) ctx.addIssue({ path: ["certificate.file"], message: "Arquivo obrigatório" });
        if (!data.certificate?.expireAt) ctx.addIssue({ path: ["certificate.expireAt"], message: "Campo obrigatório" });
        if (!data.certificate?.issuedAt) ctx.addIssue({ path: ["certificate.issuedAt"], message: "Campo obrigatório" });
        if (!data.education) ctx.addIssue({ path: ["education"], message: "Arquivo obrigatório" });
        if (!data.notes_copy) ctx.addIssue({ path: ["notes_copy"], message: "Arquivo obrigatório" });
    } else if (type === ENTITY_GROUP_TYPE.CEBAS_CERTIFICATE) {
        // if (!data.certificate?.file) ctx.addIssue({ path: ["certificate.file"], message: "Arquivo obrigatório" });
        if (!data.certificate?.expireAt) ctx.addIssue({ path: ["certificate.expireAt"], message: "Campo obrigatório" });
        if (!data.certificate?.issuedAt) ctx.addIssue({ path: ["certificate.issuedAt"], message: "Campo obrigatório" });
    } else if (type === ENTITY_GROUP_TYPE.CEBAS_EXTENSION) {
        // if (!data.deadline?.file) ctx.addIssue({ path: ["deadline.file"], message: "Arquivo obrigatório" });
        if (!data.deadline?.issuedAt) ctx.addIssue({ path: ["deadline.issuedAt"], message: "Campo obrigatório" });
    } else if (type === ENTITY_GROUP_TYPE.CEBAS_EDUCATION) {
        if (!data.education) ctx.addIssue({ path: ["education"], message: "Arquivo obrigatório" });
    } else if (type === ENTITY_GROUP_TYPE.CEBAS_NOTES_COPY) {
        if (!data.notes_copy) ctx.addIssue({ path: ["notes_copy"], message: "Arquivo obrigatório" });
    }
})