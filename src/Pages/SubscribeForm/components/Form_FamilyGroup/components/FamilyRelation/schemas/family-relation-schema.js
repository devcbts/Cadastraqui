const { z } = require("zod");

const familyRelationSchema = z.object({
    relationship: z.string().min(1, 'Parentesco obrigatório'),
    otherRelationship: z.string().nullish()
}).refine(data => (data.relationship !== "Other" || data.otherRelationship), { message: 'Relação obrigatória', path: ["otherRelationship"] })

export default familyRelationSchema