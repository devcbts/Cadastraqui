import { z } from 'zod';

export const DocumentSectionEnum = z.enum([
    "identity", "housing", "family-member", "monthly-income", "income", "bank", 
    "registrato", "statement", "health", "medication", "vehicle", "expenses", 
    "loan", "financing", "credit-card", "declaracoes", "pix"
]);

export type DocumentSectionEnum = z.infer<typeof DocumentSectionEnum>;