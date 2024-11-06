import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import FilePreview from "Components/FilePreview";
import FormCheckbox from "Components/FormCheckbox";
import useControlForm from "hooks/useControlForm";
import { useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import BasicInformation from "./components/BasicInformation";
import Course from "./components/Course";
import Documents from "./components/Documents";
import FamilyGroup from "./components/FamilyGroup";
import Habitation from "./components/Habitation";
import Health from "./components/Health";
import Interview from "./components/Interview";
import Scholarship from "./components/Scholarship";
import SummaryData from "./components/SummaryData";
import UploadButton from "./components/UploadButton";
import Vehicle from "./components/Vehicle";
import Visit from "./components/Visit";
import { selectionProcessContext } from "./context/SelectionProcessContext";
import reportSchema from "./schemas/report-schema";
import styles from './styles.module.scss';
import IndicatorChart from "Components/Announcement/InterestCards/IndicatorChart";
import ChartAI from "./components/ChartAI";
import { ReactComponent as Lab } from 'Assets/icons/lab.svg'
export default function CandidateInfo() {
    const { data, setData, summary, setSummary } = useContext(selectionProcessContext)
    const { state } = useLocation()
    const navigate = useNavigate()
    const { control, formState: { isValid }, trigger, watch } = useControlForm({
        schema: reportSchema,
        defaultValues: {
            check_report: !!summary?.majoracao ?? !!data?.majoracao
        }
    })

    const fileRef = useRef(null)
    const watchReport = watch("check_report")
    const handleSubmit = () => {
        if (!isValid) {
            trigger()
            return
        }
        navigate('../parecer', { state: { ...state, data } })

    }
    useEffect(() => {
        if (!watchReport) {
            setData((prev) => ({ ...prev, majoracao: null }))
        }
    }, [watchReport])

    const handleSearchCNPJ = async (isCandidate) => {
        try {
            const response = await socialAssistantService.findCPFCNPJ(state?.applicationId)
            if (response) {
                isCandidate
                    ? setSummary((prev) => ({
                        ...prev,
                        candidateInfo: { ...prev.candidateInfo, hasCompany: !!response.data?.empresas?.length }
                    }))
                    : setSummary((prev) => ({
                        ...prev,
                        responsibleInfo: { ...prev.responsibleInfo, hasCompany: !!response.data?.empresas?.length }
                    }))
            }
        } catch (err) { }
    }
    const handleDocument = async (file) => {
        try {

            const formData = new FormData()
            formData.append("majoracao", file)
            await socialAssistantService.uploadMajoracao(state?.applicationId, formData)
            NotificationService.success({ text: 'Documento de majoração salvo' })
        } catch (err) {
            NotificationService.error({ text: 'Falha ao realizar upload do documento' })
        }
    }

    return (
        <div className={styles.container}>
            <BackPageTitle title={'Processo de seleção'} path={-1} />
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
                <div>
                    <h3 style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                        Análise inteligente Cadastraqui
                        <span>{<Lab />}</span>
                        <span style={{ color: 'red' }}>TESTE</span>
                    </h3>
                    <ChartAI applicationId={state?.applicationId}>
                        <p style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>Análise completa <span>
                            <ButtonBase label={'visualizar'} onClick={() => navigate('analise', { state: { applicationId: state?.applicationId } })} />
                        </span>
                        </p>
                    </ChartAI>
                </div>
                <BasicInformation data={summary.candidateInfo} onSearch={handleSearchCNPJ} title={'Quadro sintético do candidato'} />
                <BasicInformation data={summary.responsibleInfo} onSearch={handleSearchCNPJ} title={'Responsável legal'} isCandidate={false} />
                <FamilyGroup data={summary.familyMembersInfo} />
                <SummaryData data={summary.importantInfo} />
                <Course data={summary.applicationInfo} />
                <Vehicle data={summary.vehicles} />
                <Habitation data={summary.housingInfo} />
                <Health data={summary.familyMembersDiseases} />
                <Documents data={summary.documentsUrls} solicitations={summary?.solicitations} />
                <Scholarship data={summary.applicationInfo} />
                <Interview data={summary.interview} />
                <Visit data={summary.visit} />

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
                        {(summary?.majoracao || data?.majoracao) ?
                            <FilePreview file={data?.fileMajoracao} url={summary?.majoracao} text={'ver documento'} />
                            : <>
                                <input hidden type="file" ref={fileRef} accept="application/pdf" onChange={(e) => {
                                    const file = e.target.files[0]
                                    setData((prev) => ({ ...prev, fileMajoracao: e.target.files[0] }))
                                    handleDocument(file)
                                }}></input>
                                <UploadButton onClick={() => fileRef?.current?.click()} />
                            </>
                        }
                    </div>}
            </div>
            <div className={styles.actions}>
                <ButtonBase label={'parecer final'} onClick={handleSubmit} />
            </div>
        </div>
    )
}