import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import { useLocation, useNavigate } from "react-router";
import EntityStudentsRenewDashboard from "./components/Dashboard";
import EntityStudentsRenewProcess from "./components/Process";

export default function EntityStudentsRenew() {
    const navigate = useNavigate()
    const { state } = useLocation()
    return (
        !state?.renewProcess
            ? <EntityStudentsRenewDashboard />
            : <EntityStudentsRenewProcess />

    )
}