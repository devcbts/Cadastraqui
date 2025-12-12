export const getDefaultSchemaValues = (schema) => {
    if (!schema) {
        return {}
    }
    return Object.entries(schema.shape).reduce((acc, [key, field]) => {
        if (field._def.typeName === 'ZodString') {
            acc[key] = '';
        } else if (field._def.typeName === 'ZodNumber') {
            acc[key] = 0;
        } else if (field._def.typeName === 'ZodBoolean') {
            acc[key] = false;
        } else if (field._def.typeName === 'ZodDate') {
            acc[key] = new Date();
        } else if (field._def.typeName === 'ZodArray') {
            acc[key] = [];
        } else if (field._def.typeName === 'ZodObject') {

            acc[key] = getDefaultSchemaValues(field);
        } else {
            acc[key] = null;
        }
        return acc;
    }, {});
};