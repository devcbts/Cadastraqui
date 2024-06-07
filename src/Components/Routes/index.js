import HomeCandidate from "Pages/Candidate/Home";
import AnnouncementView from "Pages/Candidate/Home/components/AnnouncementView";
import ProfileCandidate from "Pages/Candidate/Profile";
import Profile from "Pages/Profile";
import SubscribeForm from "Pages/SubscribeForm";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

export default function AppRoutes() {
    const role = 'a'
    return (
        <Routes>
            <Route path="/formulario_inscricao" element={<SubscribeForm />}></Route>
            <Route path="/profile" element={<ProfileCandidate />}></Route>
            <Route path="/home" element={<Outlet />}>
                <Route path="" element={<HomeCandidate />}></Route>
                <Route path="candidate-announcements" element={<AnnouncementView />}></Route>
            </Route>
        </Routes>
    )
}