import { z } from "zod";

const metadataSchema = z.object({
    type: z.string()
})
    .catchall(z.any())
    .partial()

export default metadataSchema