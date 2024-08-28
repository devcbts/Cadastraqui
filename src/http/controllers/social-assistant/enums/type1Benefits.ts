import { scholarshipGrantedType } from "backup_prisma/generated/clientBackup";
import { z } from "zod";


export const type1Benefits = z.enum([
    scholarshipGrantedType.FOOD,
    scholarshipGrantedType.TRANSPORT,
    scholarshipGrantedType.UNIFORM,
    scholarshipGrantedType.HOUSING,
    scholarshipGrantedType.STUDY_MATERIAL,
    
])