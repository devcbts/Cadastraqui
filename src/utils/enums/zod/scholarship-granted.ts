import { ScholarshipGrantedStatus } from "@prisma/client";
import { z } from "zod";

export const SCHOLARSHIP_GRANTED_STATUS =
    z.enum([ScholarshipGrantedStatus.GAVEUP, ScholarshipGrantedStatus.NOT_REGISTERED, ScholarshipGrantedStatus.REGISTERED, ScholarshipGrantedStatus.SELECTED])