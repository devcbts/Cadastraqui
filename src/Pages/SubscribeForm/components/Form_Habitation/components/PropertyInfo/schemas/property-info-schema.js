const { z } = require("zod");

const propertyInfoSchema = z.object({
    domicileType: z.string().min(1, 'Tipo de domicílio obrigatório'),
    timeLivingInProperty: z.string().min(1, 'Tempo vivendo na propriedade obrigatório'),
    numberOfRooms: z.string().min(1, 'Quantidade de cômodos obrigatória'),
    numberOfBedrooms: z.number({ message: 'Quantidade de dormitórios obrigatória' }),
})

export default propertyInfoSchema