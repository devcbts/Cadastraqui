import { ReactComponent as AddUser } from 'Assets/icons/add-user.svg';
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg';
import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import moneyInputMask from "Components/MoneyFormInput/money-input-mask";
import Table from "Components/Table";
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { NotificationService } from 'services/notification';
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import APPLICATION_STATUS from "utils/enums/application-status";
import CANDIDATE_APPLICATION_STATUS from 'utils/enums/candidate-application-status';
import CRITERIAS from "utils/enums/criterias";
import EDUCATION_TYPE from "utils/enums/education-type";
import findLabel from "utils/enums/helpers/findLabel";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import styles from './styles.module.scss';
export default function SelectedCandidates() {
    const navigate = useNavigate()
    const { announcementId, courseId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [application, setApplication] = useState({ candidates: [], level: {}, announcement: {}, entity: {} })
    const { auth } = useAuth()
    useEffect(() => {
        const fetchApplication = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getApplication(courseId)
                setApplication(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchApplication()
    }, [courseId])
    const getAddress = () => {
        if (application.entity) {
            const { address, addressNumber, city, neighborhood, UF } = application.entity
            return `${address}, ${addressNumber}. ${neighborhood}, ${city}/${UF}`
        }
    }
    const handleEnrollApplication = (id) => {
        NotificationService.confirm({
            title: 'Vincular inscrição?',
            text: 'Ao confirmar, você poderá analisar a ficha do candidato selecionado.',
            onConfirm: async () => {
                try {
                    await socialAssistantService.enrollApplication(announcementId, id)
                    setApplication((prev) => ({
                        ...prev, candidates: [...prev.candidates].map((application => {
                            return application.id === id ? { ...application, socialAssistant_id: auth?.uid } : application
                        }))
                    }))
                } catch (err) {
                    NotificationService.error({ text: err?.response?.data?.message })
                }
            }
        })
    }
    return (
        <div>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Processo de seleção'} path={`/processos/selecao/${announcementId}`} />
            <h2 className={styles.titleLista}>Lista de Candidatos Selecionados: Edital {application.announcement.announcementName}</h2>
            <div className={styles.informative}>
                <div className={styles.row}>
                    <div className={styles.spanInstituicao}>
                        <span>Instituição: </span>
                        <label>
                            {application.entity?.socialReason}
                        </label>
                    </div>
                    <div className={styles.divSpan}>
                        <span className={styles.spanEdital}>
                            Tipo de Educação:
                        </span>
                        <label>
                            {EDUCATION_TYPE.find(e => e.value === application.level.level)?.label}
                        </label>
                        <span className={styles.spanTotalVagas}>
                            Vagas:
                        </span>
                        <label>
                            {application.level?.verifiedScholarships}
                        </label>
                        <span className={styles.spanVigEdital}>
                            Inscritos:
                        </span>
                        <label>
                            {application.candidates.length}
                        </label>
                    </div>
                </div>
                <div className={styles.divEnd}>
                    <span>Endereço:</span>
                    <label>
                        {getAddress()}
                    </label>
                </div>

                <div className={styles.divCiclo}>
                    <span>
                        Ciclo/Ano/Série/Semestre/Curso:
                    </span>
                    <label>
                        {application?.level?.availableCourses ?? application.level?.grade}
                    </label>
                    <span>
                        Tipo de Bolsa:
                    </span>
                    <label>
                        {findLabel(SCHOLARSHIP_OFFER, application.level?.typeOfScholarship) ?? findLabel(SCHOLARSHIP_TYPE, application.level?.typeOfScholarship)}
                    </label>
                </div>
                <div className={styles.divCriterio}>
                    <span>Critério do Rank / desempate:</span>
                    <label>
                        {application.announcement?.criteria?.map(e => CRITERIAS.find(c => c.value === e)?.label).join('; ')}
                    </label>
                </div>

            </div>
            <Table.Root headers={['rank', 'candidato', 'renda bruta média', 'condição', 'pendências', 'ficha', 'ação']}>
                {
                    application.candidates.map((candidate) => {
                        return (
                            <Table.Row key={candidate.id}>
                                <Table.Cell divider>{candidate.position ?? '-'}</Table.Cell>
                                <Table.Cell >{candidate.candidateName}</Table.Cell>
                                <Table.Cell >{moneyInputMask(candidate.averageIncome?.toFixed(2)?.toString())}</Table.Cell>
                                <Table.Cell >{CANDIDATE_APPLICATION_STATUS[candidate.candidateStatus]}</Table.Cell>
                                <Table.Cell >{candidate.requests.length}</Table.Cell>
                                <Table.Cell >{findLabel(APPLICATION_STATUS, candidate?.status)}</Table.Cell>
                                <Table.Cell >


                                    {/* candidate.socialAssistant_id === auth?.uid¿ */}
                                    {candidate.socialAssistant_id !== null
                                        ? <ButtonBase onClick={
                                            candidate.position === null
                                                ? null
                                                :
                                                () => navigate('resumo', {
                                                    state: {
                                                        candidateId: candidate.candidate_id,
                                                        applicationId: candidate.id
                                                    }
                                                })
                                        }
                                            disabled={candidate.position === null}
                                        >
                                            <Magnifier width={14} height={14} />
                                        </ButtonBase>
                                        : <ButtonBase onClick={
                                            candidate.position === null
                                                ? null
                                                :
                                                () => handleEnrollApplication(candidate.id)
                                        }
                                            disabled={candidate.position === null}
                                        >
                                            <AddUser width={14} height={14} />
                                        </ButtonBase>
                                    }



                                </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Root>
        </div>
    )
}