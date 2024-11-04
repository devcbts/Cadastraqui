import HomeCandidate from "Pages/Candidate/Home";
import ProfileCandidate from "Pages/Candidate/Profile";
import SubscribeForm from "Pages/SubscribeForm";
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import AnnouncementCandidate from "Pages/Candidate/Announcement";
import AnnouncementView from "Pages/Candidate/Announcement/components/AnnouncementView";
import RoleRoutes from "./components/RoleRoutes";
import SelectionProcess from "Pages/SocialAssistant/SelectionProcess";
import SocialAssistantAnnouncement from "Pages/SocialAssistant/SelectionProcess/Announcement";
import SelectedCandidates from "Pages/SocialAssistant/SelectionProcess/SelectedCandidates";
import CandidateInfo from "Pages/SocialAssistant/SelectionProcess/CandidateInfo";
import LegalOpinion from "Pages/SocialAssistant/SelectionProcess/LegalOpinion";
import SocialAssistantProfile from "Pages/SocialAssistant/Profile";
import Login from "Pages/Login";
import Register from "Pages/Register";
import EntitySelectRegister from "Pages/Entity/Register";
import EntityAnnouncement from "Pages/Entity/Announcement";
import EntityAnnouncementView from "Pages/Entity/AnnouncementView";
import AdminRegister from "Pages/Admin/Register";
import EntityProfile from "Pages/Entity/Profile";
import EntityAccounts from "Pages/Entity/Accounts";
import EntityHome from "Pages/Entity/Home";
import CandidateRequest from "Pages/Candidate/Request";
import CandidatePendency from "Pages/Candidate/Request/Pendency";
import SelectionProcessContext from "Pages/SocialAssistant/SelectionProcess/CandidateInfo/context/SelectionProcessContext";
import AdminHome from "Pages/Admin/Home";
import AdminEntityView from "Pages/Admin/EntityView";
import PasswordRecovery from "Pages/PasswordRecovery";
import RedirectWithParams from "Components/RedirectWithParams";
import AssistantAnnouncementSchedule from "Pages/SocialAssistant/Schedule/components/AssistantAnnouncementSchedule";
import AssistantCandidateSchedule from "Pages/SocialAssistant/Schedule/components/AssistantCandidateSchedule";
import CandidateHistory from "Pages/Candidate/History";
import ApplicationHistory from "Pages/Candidate/History/components/ApplicationHistory";
import CandidateScheduleView from "Pages/Candidate/Schedule/components/CandidateScheduleView";
import CandidateSchedule from "Pages/Candidate/Schedule";
import AssistantSchedule from "Pages/SocialAssistant/Schedule";
import AssistantHome from "Pages/SocialAssistant/Home";
import EntityApplicants from "Pages/Entity/Applicants";
import EntityAnnouncementCourses from "Pages/Entity/Applicants/components/AnnouncementCourses";
import EntityAnnouncementApplicants from "Pages/Entity/Applicants/components/AnnouncementApplicants";
import CandidateSAC from "Pages/Candidate/SAC";
import CandidateCreateSAC from "Pages/Candidate/SAC/components/CreateSAC";
import ChatSAC from "Pages/SAC/components/Chat";
import SAC from "Pages/SAC";
import AssistantManagement from "Pages/SocialAssistant/Management";
import AssistantManagementAnnouncements from "Pages/SocialAssistant/Management/components/Announcements";
import AssistantManagerSelectedAnnouncement from "Pages/SocialAssistant/Management/components/SelectedAnnouncement";
import AssistantManagerSelectedCourse from "Pages/SocialAssistant/Management/components/SelectedCourse";
import AdminAccounts from "Pages/Admin/Accounts";
import AdminAccountInfoView from "Pages/Admin/Accounts/components/InfoView";
import AdminAccountHistory from "Pages/Admin/Accounts/components/History";
import StudentManager from "Pages/Students/Manager";
import RegisterStudents from "Pages/Students/Register";
import StudentsDashboard from "Pages/Students/Dashboard";
import StudentList from "Pages/Students/Listing";
import EntityStudentsRenew from "Pages/Students/Renew";
import EntityApplicantsRegisterApplicant from "Pages/Entity/Applicants/components/RegisterApplicant";
import AdminProfile from "Pages/Admin/Profile";
import StudentListInformation from "Pages/Students/Listing/components/StudentInformation";
import StudentDocuments from "Pages/Students/Listing/components/StudentInformation/components/StudentDocuments";
import StudentInterviews from "Pages/Students/Listing/components/StudentInformation/components/StudentInterviews";
import StudentRenewAnnouncements from "Pages/Students/Listing/components/StudentInformation/components/StudentRenewAnnouncements";
import StudentEmails from "Pages/Students/Listing/components/StudentInformation/components/StudentsEmails";
import InterestListing from "Pages/InterestListing";

export default function AppRoutes() {
    // TODO: create role based routes for CANDIDATE, RESPONSIBLE, ASSISTANT, ENTITY, ADMIN
    // Create proxy screen to ensure user is logged in on application
    // Create NOT_FOUND screen to avoid blank pages
    return (
        <>
            <RoleRoutes role={null}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/registrar" element={<Register />} />
                    <Route path="/reset_password" element={<PasswordRecovery />} />
                    <Route path="/edital/:announcementId" element={<RedirectWithParams path={'/'} />}></Route>
                    <Route path="*" element={<Navigate to={'/'} replace />} />

                </Routes>
            </RoleRoutes>
            <RoleRoutes role={["CANDIDATE", "RESPONSIBLE"]}>
                <Routes>
                    <Route path="/formulario-inscricao" element={<SubscribeForm />}></Route>
                    <Route path="/profile" element={<ProfileCandidate />}></Route>
                    <Route path="/home" element={<Outlet />}>
                        <Route path="" element={<HomeCandidate />}></Route>
                        <Route path="editais" element={<Outlet />}>
                            <Route path="" element={<AnnouncementCandidate />}></Route>
                            <Route path=":announcementId" element={<AnnouncementView />}></Route>
                        </Route>
                    </Route>
                    <Route path="/edital/:announcementId" element={<AnnouncementView />}></Route>
                    <Route path="/solicitacoes" element={<Outlet />} >
                        <Route path="" element={<CandidateRequest />} />
                        <Route path=":applicationId" element={<CandidatePendency />} />
                    </Route>
                    <Route path="/historico" element={<Outlet />}>
                        <Route index element={<CandidateHistory />} />
                        <Route path={':applicationId'} element={<ApplicationHistory />} />
                    </Route>
                    <Route path="/agenda" element={<Outlet />}>
                        <Route index element={<CandidateSchedule />} />
                        <Route path=':scheduleId' element={<CandidateScheduleView />} />
                    </Route>
                    <Route path="/sac" element={<Outlet />}>
                        <Route index element={<CandidateSAC />} />
                        <Route path="novo" element={<CandidateCreateSAC />} />
                        <Route path=":id" element={<ChatSAC />} />
                    </Route>
                    <Route path="*" element={<Navigate to={'/home'} replace />} />

                </Routes>

            </RoleRoutes>
            <RoleRoutes role="ASSISTANT">

                <Routes>
                    <Route path="/home" element={<AssistantHome />} />
                    <Route path="/processos" element={<Outlet />} >
                        <Route path="" element={<SelectionProcess />}></Route>
                        <Route path="selecao/:announcementId" element={<Outlet />} >
                            <Route path="" element={<SocialAssistantAnnouncement />}></Route>
                            <Route path=":courseId" element={<Outlet />}>
                                <Route index element={<SelectedCandidates />}></Route>
                                <Route element={<SelectionProcessContext>
                                    <Outlet />
                                </SelectionProcessContext>
                                }>
                                    <Route path="candidato" element={<CandidateInfo />}></Route>
                                    <Route path="parecer" element={<LegalOpinion />}></Route>
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="/ficha-completa" element={<SubscribeForm backButtonText="Processo de seleção" />}></Route>
                    <Route path="/profile" element={<SocialAssistantProfile />}></Route>
                    <Route path="/agenda" element={<Outlet />}>
                        <Route index element={<AssistantSchedule />} />
                        <Route path=':announcementId' element={<Outlet />} >
                            <Route index element={<AssistantAnnouncementSchedule />} />

                            <Route path="candidato/:scheduleId" element={<AssistantCandidateSchedule />} />
                        </Route>

                    </Route>
                    <Route path="/gerencial" element={<Outlet />}>
                        <Route index element={<AssistantManagement />} />
                        <Route path="editais" element={<Outlet />} >
                            <Route index element={<AssistantManagementAnnouncements />} />
                            <Route path=":announcementId" element={<Outlet />} >
                                <Route index element={<AssistantManagerSelectedAnnouncement />} />
                                <Route path=":courseId" element={<AssistantManagerSelectedCourse />} />
                                <Route path="relatorios" element={<AssistantManagerSelectedCourse />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="/alunos" element={<Outlet />}>
                        <Route index element={<StudentsDashboard />} />
                        <Route path="gestao" element={<Outlet />} >
                            <Route index element={<StudentManager />} />
                            <Route path="lista" element={<Outlet />} >
                                <Route index element={<StudentList />} />
                                <Route path=":studentId" element={<Outlet />} >
                                    <Route index element={<StudentListInformation />} />
                                    <Route path="ficha-completa" element={<SubscribeForm backButtonText="Voltar para aluno" />} />
                                    <Route path="documentos" element={<StudentDocuments />} />
                                    <Route path="entrevistas" element={<StudentInterviews />} />
                                    <Route path="emails" element={<StudentEmails />} />
                                    <Route path="renovacoes" element={<StudentRenewAnnouncements />} />
                                </Route>
                            </Route>
                        </Route>
                        <Route path="renovacao" element={<EntityStudentsRenew />} />
                    </Route>
                    <Route path="/interessados" element={<InterestListing />} />
                    <Route path="*" element={<Navigate to={'/home'} />} replace />

                </Routes>


            </RoleRoutes>
            <RoleRoutes role={["ENTITY", "ENTITY_DIRECTOR"]}>
                <Routes>
                    <Route path="/home" element={<EntityHome />} />
                    <Route path="/cadastro" element={<EntitySelectRegister />}></Route>
                    <Route path="/editais" element={<Outlet />}>
                        <Route path="" element={<EntityAnnouncement />} />
                        <Route path=":announcementId" element={<EntityAnnouncementView />} />
                    </Route>
                    <Route path="/matriculados" element={<Outlet />} >
                        <Route index element={<EntityApplicants />} />
                        <Route path=":announcementId" element={<Outlet />} >
                            <Route index element={<EntityAnnouncementCourses />} />
                            <Route path=":courseId" element={<Outlet />} >
                                <Route index element={<EntityAnnouncementApplicants />} />
                                <Route path="matricula" element={<Outlet />} >
                                    <Route index element={<EntityApplicantsRegisterApplicant />} />
                                    <Route path="ficha-completa" element={<SubscribeForm backButtonText="Voltar para matrícula" />} />
                                </Route>
                            </Route>
                        </Route>
                    </Route>
                    <Route path="/profile" element={<EntityProfile />} />
                    <Route path="/contas" element={<EntityAccounts />} />
                    <Route path="/alunos" element={<Outlet />}>
                        <Route index element={<StudentsDashboard />} />
                        <Route path="gestao" element={<Outlet />} >
                            <Route index element={<StudentManager />} />
                            <Route path="registro" element={<RegisterStudents />} />
                            <Route path="lista" element={<Outlet />} >
                                <Route index element={<StudentList />} />
                                <Route path=":studentId" element={<Outlet />} >
                                    <Route index element={<StudentListInformation />} />
                                    <Route path="ficha-completa" element={<SubscribeForm backButtonText="Voltar para aluno" />} />
                                    <Route path="documentos" element={<StudentDocuments />} />
                                    <Route path="entrevistas" element={<StudentInterviews />} />
                                    <Route path="emails" element={<StudentEmails />} />
                                    <Route path="renovacoes" element={<StudentRenewAnnouncements />} />

                                </Route>

                            </Route>
                        </Route>
                        <Route path="renovacao" element={<EntityStudentsRenew />} />
                    </Route>
                    <Route path="*" element={<Navigate to={'/home'} replace />} />

                </Routes>


            </RoleRoutes>
            <RoleRoutes role="ADMIN">

                <Routes>
                    <Route path="/home" element={<Outlet />} >
                        <Route index element={<AdminHome />} />
                        <Route path=":entityId" element={<AdminEntityView />} />
                    </Route>
                    <Route path="/cadastro" element={<AdminRegister />} />
                    <Route path="/sac" element={<Outlet />}>
                        <Route index element={<SAC />} />
                        <Route path=":id" element={<ChatSAC />} />
                    </Route>
                    <Route path="/contas" element={<Outlet />}>
                        <Route index element={<AdminAccounts />} />
                        <Route path=":userId" element={<Outlet />} >
                            <Route index element={<AdminAccountInfoView />} />
                            <Route path="sac" element={<AdminAccountHistory filter={'sac'} />} />
                            <Route path="login" element={<AdminAccountHistory filter={'login'} />} />
                        </Route>
                    </Route>
                    <Route path="/profile" element={<AdminProfile />} />
                    <Route path="*" element={<Navigate to={'/home'} replace />} />
                </Routes>

            </RoleRoutes>
        </>
    )
}