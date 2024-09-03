import interviewSchema from "Pages/Entity/Register/components/Announcement/components/AnnouncementInfo/schemas/interview-schema";
import formatDate from "utils/format-date";
import { z } from "zod";

const createScheduleSchema = ({
    minDate, maxDate,
}) => interviewSchema.superRefine((data, ctx) => {
    if (data.startDate && (data.startDate < minDate)) {
        ctx.addIssue({
            message: `Deve ser depois de ${formatDate(minDate)}`,
            path: ['startDate']
        })
    }
    if (data.endDate && (data.endDate > maxDate)) {
        ctx.addIssue({
            message: `Deve ser antes de ${formatDate(maxDate)}`,
            path: ['endDate']
        })
    }
    if (data.endDate && (data.endDate < minDate)) {
        ctx.addIssue({
            message: `Deve ser depois de ${formatDate(minDate)}`,
            path: ['endDate']
        })
    }
    if (data.startDate && (data.startDate > maxDate)) {
        ctx.addIssue({
            message: `Deve ser antes de ${formatDate(maxDate)}`,
            path: ['startDate']
        })
    }
})
export default createScheduleSchema