import { ENTITY_GROUP_TYPE } from "utils/enums/entity-group-document-type";
import { z } from "zod";

export const informationRequestSchema = (type) => z.object({
    certificate: z.object({
        file: z.instanceof(File).nullish(),
        number: z.string().nullish(),
        expireAt: z.string().nullish(),
        issuedAt: z.string().nullish(),
    }),
    answer: z.object({
        file: z.instanceof(File).nullish(),
        issuedAt: z.string().nullish(),
    })
}).partial().superRefine((data, ctx) => {
    console.log('context', type)
    if (type === undefined) {
        if (!data.certificate?.file) ctx.addIssue({ path: ["certificate.file"], message: "Arquivo obrigatório" });
        if (isNaN(data.certificate?.number)) ctx.addIssue({ path: ["certificate.number"], message: "Somente números" });
        if (!data.certificate?.expireAt) ctx.addIssue({ path: ["certificate.expireAt"], message: "Campo obrigatório" });
        if (!data.certificate?.issuedAt) ctx.addIssue({ path: ["certificate.issuedAt"], message: "Campo obrigatório" });
        if (!data.answer?.file) ctx.addIssue({ path: ["answer.file"], message: "Arquivo obrigatório" });
        if (!data.answer?.issuedAt) ctx.addIssue({ path: ["answer.issuedAt"], message: "Campo obrigatório" });
    } else if (type === ENTITY_GROUP_TYPE.INFORMATION_REQUEST_CERTIFICATE) {
        // if (!data.certificate?.file) ctx.addIssue({ path: ["certificate.file"], message: "Arquivo obrigatório" });
        if (isNaN(data.certificate?.number)) ctx.addIssue({ path: ["certificate.number"], message: "Somente números" });
        if (!data.certificate?.expireAt) ctx.addIssue({ path: ["certificate.expireAt"], message: "Campo obrigatório" });
        if (!data.certificate?.issuedAt) ctx.addIssue({ path: ["certificate.issuedAt"], message: "Campo obrigatório" });
    } else if (type === ENTITY_GROUP_TYPE.INFORMATION_REQUEST_ANSWER) {
        // if (!data.deadline?.file) ctx.addIssue({ path: ["deadline.file"], message: "Arquivo obrigatório" });
        if (!data.answer?.issuedAt) ctx.addIssue({ path: ["answer.issuedAt"], message: "Campo obrigatório" });
    }
})