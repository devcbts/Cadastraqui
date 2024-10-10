const { z } = require("zod");

const ccsFileSchema = (fieldName) => z.object({

    [`file_${fieldName}`]: z.instanceof(File, 'Arquivo obrigatório'),
    [`url_${fieldName}`]: z.string().nullish(),
    // [`metadata_${fieldName}`]: z.object(z.any())

})

export default ccsFileSchema