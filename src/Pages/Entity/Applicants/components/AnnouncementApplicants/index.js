import BackPageTitle from "Components/BackPageTitle";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import entityService from "services/entity/entityService";
import APPLICATION_STATUS from "utils/enums/application-status";
import findLabel from "utils/enums/helpers/findLabel";
import formatMoney from "utils/format-money";
import styles from '../../../../SocialAssistant/SelectionProcess/SelectedCandidates/styles.module.scss'
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
import EDUCATION_TYPE from "utils/enums/education-type";
import CANDIDATE_APPLICATION_STATUS from "utils/enums/candidate-application-status";
import ButtonBase from "Components/ButtonBase";
import { SCHOLARSHIP_STATUS, SCHOLARSHIP_STATUS_TRANSLATION } from "utils/enums/scholarship-granted-status";
import { NotificationService } from "services/notification";
import Modal from "Components/Modal";
export default function EntityAnnouncementApplicants() {
    const { courseId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [course, setCourse] = useState(null)
    const [students, setStudents] = useState({ waitingRegister: [], registered: [], fetch: false })
    const { state } = useLocation()
    const navigate = useNavigate()
    const [modal, setModal] = useState(null)
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setIsLoading(true)
                const information = await Promise.all([
                    entityService.getAnnouncementCourse(courseId),
                    entityService.getScholarshipsByCourse(courseId)
                ])

                setCourse(information[0])
                setStudents((prev) => ({ ...prev, waitingRegister: information[1] }))

            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchCourse()
    }, [])
    useEffect(() => {
        if (students.fetch || !state?.view) { return }
        const fetchRegisteredStudents = async () => {
            try {
                setIsLoading(true)

                const information = await entityService.getRegisteredByCourse(courseId)
                setStudents((prev) => ({ ...prev, applicants: information.Application }))
                setStudents((prev) => ({ ...prev, registered: information, fetch: true }))
            } catch (err) { }
            setIsLoading(false)

        }
        fetchRegisteredStudents()
    }, [state])
    const handleChangeView = () => {
        if (!state?.view || state.view === 'selected') {
            return navigate('', { state: { view: 'registered' } })
        } else {
            return navigate('', { state: { view: 'selected' } })
        }
    }

    const location = course?.entity
    const isSelectedView = !state?.view || state?.view === "selected"
    const handleUpdateUserScholarship = ({ id, status = null }) => {
        const updatefn = async () => {
            try {
                await entityService.updateScholarshipStatus(id, status)
                setStudents((prev) => ({ ...prev, registered: prev.registered.map(e => e.id === id ? { ...e, status } : e) }))
                NotificationService.success({ title: 'Status alterado' })
            } catch (err) {
                NotificationService.error({ title: err?.response?.data?.message })

            }
        }
        if (!status) {
            setModal({ id, reason: '' })
        } else {
            updatefn()
        }

    }
    const handleChangeReason = (status) => {
        setModal((prev) => ({ ...prev, reason: status }))
    }
    return (
        <>
            <Loader loading={isLoading} />
            <Modal open={!!modal} title={'Qual o motivo?'} onCancel={() => setModal(null)} onConfirm={() => handleUpdateUserScholarship({ id: modal.id, status: modal.reason })}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', margin: '24px 12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                        <ButtonBase label={'Desistência'} onClick={() => {

                            handleChangeReason(SCHOLARSHIP_STATUS.GAVEUP)
                        }} />
                        <ButtonBase label={'Não se matriculou'} onClick={() => {
                            handleChangeReason(SCHOLARSHIP_STATUS.NOT_REGISTERED)
                        }} />
                    </div>
                    <h4>Alterar para: {SCHOLARSHIP_STATUS_TRANSLATION[modal?.reason]}</h4>
                </div>
            </Modal>
            <div>

                <BackPageTitle title={isSelectedView ? 'Alunos selecionados para matrícula' : 'Matriculados'} path={-1} />
                <ButtonBase label={isSelectedView ? 'Alunos matriculados' : 'Alunos selecionados'} onClick={handleChangeView} />
            </div>
            {/* TODO: Create shareable component within SocialAssistant/SelectCandidates */}
            {course && <div className={styles.informative}>
                <div className={styles.row}>
                    <div className={styles.spanInstituicao}>
                        <span>Instituição: </span>
                        <label>
                            {course.entity?.socialReason}
                        </label>
                    </div>
                    <div className={styles.divSpan}>
                        <span className={styles.spanEdital}>
                            Tipo de Educação:
                        </span>
                        <label>
                            {findLabel(EDUCATION_TYPE, course.level)}
                        </label>
                        <span className={styles.spanVigEdital}>
                            Vagas:
                        </span>
                        <label>
                            {course.verifiedScholarships}
                        </label>
                    </div>
                </div>
                <div className={styles.divEnd}>
                    <span>Endereço:</span>
                    <label>
                        {`${location.address}, ${location.addressNumber}. ${location.neighborhood}, ${location.city}/${location.UF}`}
                    </label>
                </div>

                <div className={styles.divCiclo}>
                    <span>
                        Ciclo/Ano/Série/Semestre/Curso:
                    </span>
                    <label>
                        {course?.availableCourses ?? course.grade}
                    </label>
                    <span>
                        Tipo de Bolsa:
                    </span>
                    <label>
                        {findLabel(SCHOLARSHIP_OFFER, course.scholarshipType) ?? findLabel(SCHOLARSHIP_TYPE, course.higherEduScholarshipType)}
                    </label>
                </div>


            </div>}
            {isSelectedView
                ? <Table.Root headers={['nome completo', 'status', 'matriculado?']}>
                    {
                        students.waitingRegister?.map(e => (
                            <Table.Row key={e.id}>
                                <Table.Cell>{e.candidateName}</Table.Cell>
                                <Table.Cell>{SCHOLARSHIP_STATUS_TRANSLATION[e.status]}</Table.Cell>
                                <Table.Cell>
                                    {e.status === SCHOLARSHIP_STATUS.SELECTED
                                        ? (
                                            <>
                                                <ButtonBase label={'sim'} onClick={() => handleUpdateUserScholarship({ id: e.id, status: SCHOLARSHIP_STATUS.REGISTERED })} />
                                                <ButtonBase label={'não'} danger onClick={() => handleUpdateUserScholarship({ id: e.id })} />
                                            </>
                                        )
                                        : '-'
                                    }
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Root>
                : <Table.Root headers={['rank', 'candidato']}>
                    {
                        students.registered?.map(e => (
                            <Table.Row key={e.id}>
                                <Table.Cell divider>{e.position ?? '-'}</Table.Cell>
                                <Table.Cell>{e.candidateName}</Table.Cell>
                                {/* <Table.Cell>{findLabel(APPLICATION_STATUS, e.status)}</Table.Cell> */}
                            </Table.Row>
                        ))
                    }
                </Table.Root>
            }
        </>
    )
}