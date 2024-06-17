import BackPageTitle from "Components/BackPageTitle";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import styles from './styles.module.scss'
import BasicInformation from "./components/BasicInformation";
import FamilyGroup from "./components/FamilyGroup";
import SummaryData from "./components/SummaryData";
import Course from "./components/Course";
import Vehicle from "./components/Vehicle";
import Health from "./components/Health";
import Habitation from "./components/Habitation";
import ButtonBase from "Components/ButtonBase";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import Loader from "Components/Loader";
import Documents from "./components/Documents";
import Scholarship from "./components/Scholarship";
import Interview from "./components/Interview";
export default function CandidateInfo() {
    const location = useLocation()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [summary, setSummary] = useState({
        candidateInfo: {},
        familyMembersInfo: [],
        housingInfo: {},
        vehicles: [],
        familyMembersDiseases: [],
        importantInfo: {},
        documentsUrls: {},
        applicationInfo: {},
    })
    const { state } = location
    useEffect(() => {
        if (!state) {
            navigate(-1)
        } else {
            const { applicationId } = state
            // TODO: load all user information to display on screen
            const fetchCandidateInfo = async () => {
                try {
                    setIsLoading(true)
                    const information = await socialAssistantService.getCandidateResume(applicationId)
                    setSummary(information)
                } catch (err) { }
                setIsLoading(false)
            }
            fetchCandidateInfo()
        }
    }, [state])
    return (
        <div className={styles.container}>
            <Loader loading={isLoading} text="Carregando informações do candidato" />
            <BackPageTitle title={'processo de seleção'} path={-1} />
            <div className={styles.options}>
                <ButtonBase label={'ficha completa'} onClick={() => navigate('/ficha-completa', { state })} />
            </div>
            <div className={styles.content}>
                <div className={styles.summary}>
                    <span>Posição no rank: 1º</span>
                    <span>Posição no rank:
                        <strong> processo de seleção</strong>
                    </span>
                    <span>Ficha do candidato: Em análise</span>
                </div>
                <BasicInformation data={summary.candidateInfo} />
                <FamilyGroup data={summary.familyMembersInfo} />
                <SummaryData data={summary.importantInfo} />
                <Course data={summary.applicationInfo} />
                <Vehicle data={summary.vehicles} />
                <Habitation data={summary.housingInfo} />
                <Health data={summary.familyMembersDiseases} />
                <Documents />
                <Scholarship />
                <Interview />
            </div>
            <div className={styles.actions}>
                <ButtonBase label={'parecer final'} onClick={() => navigate('/parecer', { state })} />
            </div>
        </div>
    )
}