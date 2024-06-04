import HomeCandidate from "Pages/Candidate/Home";
import ProfileCandidate from "Pages/Candidate/Profile";
import SubscribeForm from "Pages/SubscribeForm";
import { Outlet, Route, Routes } from "react-router-dom";
import AnnouncementCandidate from "Pages/Candidate/Announcement";
import AnnouncementView from "Pages/Candidate/Announcement/components/AnnouncementView";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/formulario_inscricao" element={<SubscribeForm />}></Route>
            <Route path="/profile" element={<ProfileCandidate />}></Route>
            <Route path="/home" element={<Outlet />}>
                <Route path="" element={<HomeCandidate />}></Route>
                <Route path="editais" element={<Outlet />}>
                    <Route path="" element={<AnnouncementCandidate />}></Route>
                    <Route path=":entityId" element={<AnnouncementView />}></Route>
                </Route>
                <Route path="edital/:announcementId" element={<AnnouncementView />}></Route>

            </Route>
        </Routes>
    )
}