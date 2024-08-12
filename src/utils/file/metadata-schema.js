import { z } from "zod";

const metadataSchema = z.object({
    type: z.string()
})
    .partial()

export default metadataSchema