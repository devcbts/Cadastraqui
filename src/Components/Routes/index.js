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
import CandidateView from "Pages/SocialAssistant/SelectionProcess/CandidateView";
import LegalOpinion from "Pages/SocialAssistant/SelectionProcess/LegalOpinion";
import SocialAssistantProfile from "Pages/SocialAssistant/Profile";
import HeaderWrapper from "Components/Header";
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
                    <Route path="*" element={<Navigate to={'/'} />} />

                </Routes>
            </RoleRoutes>
            <RoleRoutes role={["CANDIDATE", "RESPONSIBLE"]}>
                <HeaderWrapper>
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
                        <Route path="*" element={<Navigate to={'/home'} />} />

                    </Routes>
                </HeaderWrapper>
            </RoleRoutes>
            <RoleRoutes role="ASSISTANT">
                <HeaderWrapper>

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
                        <Route path="/ficha-completa" element={<CandidateView />}></Route>
                        <Route path="/profile" element={<SocialAssistantProfile />}></Route>
                        <Route path="/agenda" element={<Outlet />}>
                            <Route index element={<AssistantSchedule />} />
                            <Route path=':announcementId' element={<Outlet />} >
                                <Route index element={<AssistantAnnouncementSchedule />} />

                                <Route path="candidato/:scheduleId" element={<AssistantCandidateSchedule />} />
                            </Route>

                        </Route>
                        <Route path="*" element={<Navigate to={'/home'} />} />

                    </Routes>

                </HeaderWrapper>
            </RoleRoutes>
            <RoleRoutes role="ENTITY">
                <HeaderWrapper>
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
                                <Route path=":courseId" element={<EntityAnnouncementApplicants />} />
                            </Route>
                        </Route>
                        <Route path="/profile" element={<EntityProfile />} />
                        <Route path="/contas" element={<EntityAccounts />} />
                        <Route path="*" element={<Navigate to={'/home'} />} />

                    </Routes>

                </HeaderWrapper>
            </RoleRoutes>
            <RoleRoutes role="ADMIN">
                <HeaderWrapper>

                    <Routes>
                        <Route path="/home" element={<Outlet />} >
                            <Route index element={<AdminHome />} />
                            <Route path=":entityId" element={<AdminEntityView />} />
                        </Route>
                        <Route path="/cadastro" element={<AdminRegister />} />
                        <Route path="*" element={<Navigate to={'/home'} />} />
                    </Routes>
                </HeaderWrapper>
            </RoleRoutes>
        </>
    )
}