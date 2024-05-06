import { z } from "zod";

export const Education_Type = z.enum([
    'Alfabetizacao',
    'Ensino_Medio',
    'Ensino_Tecnico',
    'Ensino_Superior',
  ])