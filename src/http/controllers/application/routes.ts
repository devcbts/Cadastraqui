import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyRole } from "@/http/middlewares/verify-role";
import { FastifyInstance } from "fastify";
import { getBankingInfoHDB } from "./detailed-form/get-banking-info";
import { getBasicInfoHDB } from "./detailed-form/get-basic-info";
import { getDeclarationsPDF } from "./detailed-form/get-declarations";
import { getExpensesInfoHDB } from "./detailed-form/get-expenses";
import { getFamilyMemberInfoHDB } from "./detailed-form/get-family-member-info";
import { getHealthInfoHDB } from "./detailed-form/get-health-info";
import { getHousingInfoHDB } from "./detailed-form/get-housing-info";
import { getIdentityInfoHDB } from "./detailed-form/get-identity-info";
import { getIncomeInfoHDB } from "./detailed-form/get-income-info";
import { getMemberIncomeStatusHDB } from "./detailed-form/get-income-status-hdb";
import { getMonthlyIncomeBySourceHDB } from "./detailed-form/get-monthly-income";
import { getRegistratoHDB } from "./detailed-form/get-registrato";
import { getVehicleInfoHDB } from "./detailed-form/get-vehicle-info";

export async function applicationRoutes(app: FastifyInstance) {
    app.addHook(("onRequest"), (req, res, done) => {
        Promise.all([verifyJWT(req, res), verifyRole(["ASSISTANT", "ENTITY", "ENTITY_DIRECTOR"])])
        done()
    })
    app.get('/candidateInfo/identity/:application_id', { onRequest: [verifyJWT] }, getIdentityInfoHDB)
    app.get('/candidateInfo/basic/:application_id', { onRequest: [verifyJWT] }, getBasicInfoHDB)
    app.get('/candidateInfo/family/:application_id', { onRequest: [verifyJWT] }, getFamilyMemberInfoHDB)
    app.get('/candidateInfo/housing/:application_id', { onRequest: [verifyJWT] }, getHousingInfoHDB)
    app.get('/candidateInfo/income/:application_id', { onRequest: [verifyJWT] }, getIncomeInfoHDB)
    app.get('/candidateInfo/monthly-income/:application_id/:_id', { onRequest: [verifyJWT] }, getMonthlyIncomeBySourceHDB)
    app.get('/candidateInfo/health/:application_id', { onRequest: [verifyJWT] }, getHealthInfoHDB)
    app.get('/candidateInfo/vehicle/:application_id', { onRequest: [verifyJWT] }, getVehicleInfoHDB)
    app.get('/candidateInfo/expenses/:application_id', { onRequest: [verifyJWT] }, getExpensesInfoHDB)
    app.get('/candidateInfo/bank-info/:application_id/:_id?', { onRequest: [verifyJWT] }, getBankingInfoHDB)
    app.get('/candidateInfo/ccs/files/:application_id/:_id?', { onRequest: [verifyJWT] }, getRegistratoHDB)
    app.get('/candidateInfo/declaration/:application_id', { onRequest: [verifyJWT] }, getDeclarationsPDF)
    app.get(
        '/candidateInfo/income/status/:application_id/:_id',
        { onRequest: [verifyJWT] },
        getMemberIncomeStatusHDB,
    )

}