import { z } from "zod";

export const DOCUMENT_TYPE = z.enum([
    'DriversLicense',
    'FunctionalCard',
    'MilitaryID',
    'Foreignerapplication',
    'Passport',
    'WorkCard',
  ])