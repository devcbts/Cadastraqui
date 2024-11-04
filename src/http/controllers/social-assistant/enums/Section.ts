import { z } from 'zod';

// Enum original
export const section = z.enum([
    "identity",
    "housing",
    "family-member",
    "monthly-income",
    "income",
    "bank",
    "registrato",
    "statement",
    "health",
    "medication",
    "vehicle",
    "expenses",

    "declaracoes",
    "pix"
]);

export type section = z.infer<typeof section>;

// Enum para o banco de dados
export const dbSection = z.enum([
    "IDENTITY",
    "HOUSING",
    "FAMILY_MEMBER",
    "MONTHLY_INCOME",
    "INCOME",
    "BANK",
    "REGISTRATO",
    "STATEMENT",
    "HEALTH",
    "MEDICATION",
    "VEHICLE",
    "EXPENSES",

    "DECLARACOES",
    "PIX"
]);

export type dbSection = z.infer<typeof dbSection>;

// Mapeamento entre o enum original e o enum do banco de dados
const sectionToDbSectionMap: Record<z.infer<typeof section>, z.infer<typeof dbSection>> = {
    "identity": "IDENTITY",
    "housing": "HOUSING",
    "family-member": "FAMILY_MEMBER",
    "monthly-income": "MONTHLY_INCOME",
    "income": "INCOME",
    "bank": "BANK",
    "registrato": "REGISTRATO",
    "statement": "STATEMENT",
    "health": "HEALTH",
    "medication": "MEDICATION",
    "vehicle": "VEHICLE",
    "expenses": "EXPENSES",

    "declaracoes": "DECLARACOES",
    "pix": "PIX"
};

// Mapeamento inverso entre o enum do banco de dados e o enum original
const dbSectionToSectionMap: Record<z.infer<typeof dbSection>, z.infer<typeof section>> = {
    "IDENTITY": "identity",
    "HOUSING": "housing",
    "FAMILY_MEMBER": "family-member",
    "MONTHLY_INCOME": "monthly-income",
    "INCOME": "income",
    "BANK": "bank",
    "REGISTRATO": "registrato",
    "STATEMENT": "statement",
    "HEALTH": "health",
    "MEDICATION": "medication",
    "VEHICLE": "vehicle",
    "EXPENSES": "expenses",

    "DECLARACOES": "declaracoes",
    "PIX": "pix"
};

// Função para converter do enum original para o enum do banco de dados
export function toDbSection(sec: z.infer<typeof section>): z.infer<typeof dbSection> {
    return sectionToDbSectionMap[sec];
}

// Função para converter do enum do banco de dados para o enum original
export function fromDbSection(dbSec: z.infer<typeof dbSection>): z.infer<typeof section> {
    return dbSectionToSectionMap[dbSec];
}