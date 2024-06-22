import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg'
import styles from './styles.module.scss'
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import CRITERIAS from "utils/enums/criterias";
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
import moneyInputMask from "Components/MoneyFormInput/money-input-mask";
import SCHOOL_LEVELS from "utils/enums/school-levels";
import Loader from "Components/Loader";
import findLabel from "utils/enums/helpers/findLabel";
import APPLICATION_STATUS from "utils/enums/application-status";
export default function SelectedCandidates() {
    const navigate = useNavigate()
    const { announcementId, courseId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [application, setApplication] = useState({ candidates: [], level: {}, announcement: {}, entity: {} })
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
    return (
        <div>
            <Loader loading={isLoading} />
            <BackPageTitle title={'processo de seleção'} path={`/home/selecao/${announcementId}`} />
            <h2>Lista de Candidatos Selecionados: Edital {application.announcement.announcementNumber}</h2>
            <div className={styles.informative}>
                <div className={styles.row}>
                    <span>Instituição: {application.entity?.socialReason}</span>
                    <span>Tipo de Educação: {SCHOOL_LEVELS.find(e => e.value === application.level?.basicEduType)?.label}</span>
                    <span>Vagas: {application.level?.verifiedScholarships}</span>
                    <span>Inscritos: {application.candidates.length}</span>
                </div>
                <span>Endereço: {getAddress()}</span>
                <div className={styles.row}>
                    <span>Ciclo/Ano/Série/Semestre/Curso: {application.level?.grade}</span>
                    <span>Tipo de Bolsa: {SCHOLARSHIP_OFFER.find(e => e.value === application.level?.scholarshipType)?.label}</span>
                </div>
                <span>Critério do Rank / desempate: {application.announcement?.criteria?.map(e => CRITERIAS.find(c => c.value === e)?.label).join('; ')}</span>
            </div>
            <Table.Root headers={['rank', 'candidato', 'renda bruta média', 'condição', 'pendências', 'ficha', 'ação']}>
                {
                    application.candidates.map((candidate) => {
                        return (
                            <Table.Row>
                                <Table.Cell divider>{candidate.position ?? '-'}</Table.Cell>
                                <Table.Cell >{candidate.candidateName}</Table.Cell>
                                <Table.Cell >{moneyInputMask(candidate.averageIncome?.toString())}</Table.Cell>
                                <Table.Cell >Titular</Table.Cell>
                                <Table.Cell >0</Table.Cell>
                                <Table.Cell >{findLabel(APPLICATION_STATUS, candidate?.status)}</Table.Cell>
                                <Table.Cell >
                                    <ButtonBase onClick={() => navigate('candidato', {
                                        state: {
                                            candidateId: candidate.candidate_id,
                                            applicationId: candidate.id
                                        }
                                    })}>
                                        <Magnifier width={14} height={14} />
                                    </ButtonBase>
                                </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Root>
        </div>
    )
}