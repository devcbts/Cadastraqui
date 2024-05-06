import { z } from "zod";

export const SCHOLARSHIP = z.enum([
    'Illiterate',
    'ElementarySchool',
    'HighSchool',
    'CollegeGraduate',
    'CollegeUndergraduate',
    'Postgraduate',
    'Masters',
    'Doctorate',
    'PostDoctorate',
  ])