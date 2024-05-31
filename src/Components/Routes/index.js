import CandidateHome from "Pages/Candidate/Home";
import ProfileCandidate from "Pages/Candidate/Profile";
import Profile from "Pages/Profile";
import SubscribeForm from "Pages/SubscribeForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/formulario_inscricao" element={<SubscribeForm />}></Route>
            <Route path="/profile" element={<ProfileCandidate />}></Route>
            <Route path="/home" element={<CandidateHome />}></Route>
        </Routes>
    )
}