import { z } from "zod";

export const AccountType = z.enum([
    'CHECKING_ACCOUNT',
    'SAVINGS_ACCOUNT',
    'PAYMENT_ACCOUNT',
    'SALARY_ACCOUNT',
    'STUDENT_ACCOUNT',
    'DIGITAL_ACCOUNT',
    'MINORS_ACCOUNT',
    'BUSINESS_ACCOUNT',
    'JOINT_ACCOUNT'
  ]);

