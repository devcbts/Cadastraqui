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
import FormCheckbox from "Components/FormCheckbox";
import useControlForm from "hooks/useControlForm";
import UploadButton from "./components/UploadButton";
import reportSchema from "./schemas/report-schema";
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
    const { control, formState: { isValid }, trigger, watch } = useControlForm({
        schema: reportSchema,
        defaultValues: {
            check_report: null
        }
    })
    const watchReport = watch("check_report")
    const handleSubmit = () => {
        if (!isValid) {
            trigger()
            return
        }
        navigate('/parecer', { state })

    }
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
                {/* <div className={styles.summary}>
                    <span>Posição no rank: 1º</span>
                    <span>Posição no rank:
                        <strong> processo de seleção</strong>
                    </span>
                    <span>Ficha do candidato: Em análise</span>
                </div> */}
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

                <p style={{ marginTop: '16px' }}>
                    Será aplicada a faculdade contida no § 2º do art. 19, relacionada a majoração em até 20% (vinte por cento) do teto estabelecido (bolsa de estudo integral),
                    ao se considerar aspectos de natureza social do beneficiário, de sua família ou de ambos, quando consubstanciados em relatório comprobatório devidamente assinado
                    por assistente social com registro no respectivo órgão de classe.
                </p>
                <FormCheckbox
                    control={control}
                    name={"check_report"}
                />
                {watchReport &&
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', placeItems: 'center' }}>
                        Se sim, elaborar o relatório referente a majoração de que trata o § 2º do art. 19 da Lei Complementar nº 187, de 16 de dezembro de 2021
                        e fazer o upload do mesmo, clicando no ícone abaixo.
                        <UploadButton onClick={() => { }} />
                    </div>}
            </div>
            <div className={styles.actions}>
                <ButtonBase label={'parecer final'} onClick={handleSubmit} />
            </div>
        </div>
    )
}