import { z } from "zod";

const metadataSchema = z.object({
    type: z.string()
})
    .catchall(z.any())
    .partial()
    .nullish()

export default metadataSchema