import { z } from "zod";

export const SHIFT = z.enum(['Matutino', 'Vespertino', 'Noturno', 'Integral'])
