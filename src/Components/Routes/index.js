import HomeCandidate from "Pages/Candidate/Home";
import ProfileCandidate from "Pages/Candidate/Profile";
import SubscribeForm from "Pages/SubscribeForm";
import { Outlet, Route, Routes } from "react-router-dom";
import AnnouncementCandidate from "Pages/Candidate/Announcement";
import AnnouncementView from "Pages/Candidate/Announcement/components/AnnouncementView";
import RoleRoutes from "./components/RoleRoutes";
import SelectionProcess from "Pages/SocialAssistant/SelectionProcess";
import SocialAssistantAnnouncement from "Pages/SocialAssistant/SelectionProcess/Announcement";
import SelectedCandidates from "Pages/SocialAssistant/SelectionProcess/SelectedCandidates";

export default function AppRoutes() {
    // TODO: create role based routes for CANDIDATE, RESPONSIBLE, ASSISTANT, ENTITY, ADMIN
    // Create proxy screen to ensure user is logged in on application
    // Create NOT_FOUND screen to avoid blank pages
    return (
        <>
            <RoleRoutes role="CANDIDATE">
                <Routes>
                    <Route path="/formulario_inscricao" element={<SubscribeForm />}></Route>
                    <Route path="/profile" element={<ProfileCandidate />}></Route>
                    <Route path="/home" element={<Outlet />}>
                        <Route path="" element={<HomeCandidate />}></Route>
                        <Route path="editais" element={<Outlet />}>
                            <Route path="" element={<AnnouncementCandidate />}></Route>
                            <Route path=":announcementId" element={<AnnouncementView />}></Route>
                        </Route>
                        {/* <Route path="edital/:announcementId" element={<AnnouncementView />}></Route> */}

                    </Route>
                </Routes>
            </RoleRoutes>
            <RoleRoutes role="ASSISTANT">
                <Routes>
                    <Route path="/home" element={<Outlet />} >
                        <Route path="" element={<SelectionProcess />}></Route>
                        <Route path="selecao/:announcementId" element={<Outlet />} >

                            <Route path="" element={<SocialAssistantAnnouncement />}></Route>
                            <Route path=":courseId" element={<SelectedCandidates />}></Route>
                        </Route>
                    </Route>
                </Routes>
            </RoleRoutes>
        </>
    )
}