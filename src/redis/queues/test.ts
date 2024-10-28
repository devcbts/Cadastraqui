import { FastifyReply, FastifyRequest } from "fastify";
import { addAnalysisTask } from "./runApplicationAnalysisQueue";
import nodeSchedule from 'node-schedule';


const analysisJob: nodeSchedule.Job = nodeSchedule.scheduleJob("0 */2 * * * *", async () => {
    const deletedIncomes = await addAnalysisTask('135deb2d-3710-4337-8e68-3824964eaa0d');

})
export default analysisJob