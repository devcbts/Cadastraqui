import { EmploymentType } from '@prisma/client';
import { z } from 'zod';

const IncomeSource = z.enum(Object.values(EmploymentType).map(e => e) as [EmploymentType, ...EmploymentType[]]);

export default IncomeSource;
