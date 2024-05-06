import { z } from "zod";

export const Relationship = z.enum([
    'Wife',
    'Husband',
    'Father',
    'Mother',
    'Stepfather',
    'Stepmother',
    'Sibling',
    'Grandparent',
    'Child',
    'Other',
  ])