import { z } from "zod";


export const type1Benefits = z.enum([
    'FOOD',
    'TRANSPORT',
    'UNIFORM',
    'HOUSING',
    'STUDY_MATERIAL',
    
])