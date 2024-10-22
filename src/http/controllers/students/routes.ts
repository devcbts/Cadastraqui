import { verifyJWT } from "@/http/middlewares/verify-jwt"
import { verifyRole } from "@/http/middlewares/verify-role"
import { FastifyInstance } from "fastify"
import getAllStudents from "./get-all-students"
import getRenewCourses from "./get-renew-courses"
import getRenewDashboard from "./get-renew-dashboard"
import getStudentInformation from "./get-student-information"
import getStudentInterviews from "./get-student-interview"
import getStudentPreviousAnnouncements from "./get-student-previous-announcements"
import getStudentsDashboard from "./get-students-dashboard"
import registerNewStudents from "./register-new-students"

export default async function studentsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req, res) => {
    await verifyRole(["ASSISTANT", "ENTITY", "ENTITY_DIRECTOR"])
  })
  app.get('/dashboard', { onRequest: [verifyJWT] }, getStudentsDashboard)
  app.post('/register', { onRequest: [verifyJWT] }, registerNewStudents)
  app.get('/all', { onRequest: [verifyJWT] }, getAllStudents)
  app.get('/renew/dashbaord', { onRequest: [verifyJWT] }, getRenewDashboard)
  app.get('/renew/courses', { onRequest: [verifyJWT] }, getRenewCourses)
  app.get('/information/:student_id', { onRequest: [verifyJWT] }, getStudentInformation)
  app.get('/interviews/:candidate_id', { onRequest: [verifyJWT] }, getStudentInterviews)
  app.get('/announcements/:candidate_id', { onRequest: [verifyJWT] }, getStudentPreviousAnnouncements)
}