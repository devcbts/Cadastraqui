import { ENTITY_GROUP_TYPE } from "utils/enums/entity-group-document-type";
import { z } from "zod";

export const cebasSchema = (type, id) => z.object({
    education: z.instanceof(File).nullish(),
    notes_copy: z.instanceof(File).nullish(),
    certificate: z.object({
        file: z.instanceof(File).nullish(),
        expireAt: z.string().nullish(),
        issuedAt: z.string().nullish(),
    }),
    deadline: z.object({
        file: z.instanceof(File).nullish(),
        expireAt: z.string().nullish(),
    })
}).partial().superRefine((data, ctx) => {
    if (type === undefined) {
        if (!data.certificate?.file) ctx.addIssue({ path: ["certificate.file"], message: "Arquivo obrigatório" });
        if (!data.certificate?.expireAt) ctx.addIssue({ path: ["certificate.expireAt"], message: "Campo obrigatório" });
        if (!data.certificate?.issuedAt) ctx.addIssue({ path: ["certificate.issuedAt"], message: "Campo obrigatório" });
        if (!data.education) ctx.addIssue({ path: ["education"], message: "Arquivo obrigatório" });
        if (!data.notes_copy) ctx.addIssue({ path: ["notes_copy"], message: "Arquivo obrigatório" });
    } else if (type === ENTITY_GROUP_TYPE.CEBAS_CERTIFICATE) {
        if (!data.certificate?.file && !id) ctx.addIssue({ path: ["certificate.file"], message: "Arquivo obrigatório" });
        if (!data.certificate?.expireAt) ctx.addIssue({ path: ["certificate.expireAt"], message: "Campo obrigatório" });
        if (!data.certificate?.issuedAt) ctx.addIssue({ path: ["certificate.issuedAt"], message: "Campo obrigatório" });
    } else if (type === ENTITY_GROUP_TYPE.CEBAS_EXTENSION) {
        if (!data.deadline?.file && !id) ctx.addIssue({ path: ["deadline.file"], message: "Arquivo obrigatório" });
        if (!data.deadline?.expireAt) ctx.addIssue({ path: ["deadline.expireAt"], message: "Campo obrigatório" });
    } else if (type === ENTITY_GROUP_TYPE.CEBAS_EDUCATION) {
        if (!data.education) ctx.addIssue({ path: ["education"], message: "Arquivo obrigatório" });
    } else if (type === ENTITY_GROUP_TYPE.CEBAS_NOTES_COPY) {
        if (!data.notes_copy) ctx.addIssue({ path: ["notes_copy"], message: "Arquivo obrigatório" });
    }
})