import BackPageTitle from "Components/BackPageTitle";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import entityService from "services/entity/entityService";
import APPLICATION_STATUS from "utils/enums/application-status";
import findLabel from "utils/enums/helpers/findLabel";
import formatMoney from "utils/format-money";
import styles from '../../../../SocialAssistant/SelectionProcess/SelectedCandidates/styles.module.scss'
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
import EDUCATION_TYPE from "utils/enums/education-type";
import CANDIDATE_APPLICATION_STATUS from "utils/enums/candidate-application-status";
export default function EntityAnnouncementApplicants() {
    const { courseId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [course, setCourse] = useState(null)
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setIsLoading(true)
                const information = await entityService.getAnnouncementCourse(courseId)
                setCourse(information)
            } catch (err) {

            }
            setIsLoading(false)
        }
        fetchCourse()
    }, [])
    const location = course?.entity
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Matriculados'} path={-1} />
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
                            Matriculados:
                        </span>
                        <label>
                            {course.Application.length}
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
            <Table.Root headers={['rank', 'candidato', 'renda bruta média', 'condição', 'ficha']}>
                {
                    course?.Application?.map(e => (
                        <Table.Row>
                            <Table.Cell divider>{e.position ?? '-'}</Table.Cell>
                            <Table.Cell>{e.candidateName}</Table.Cell>
                            <Table.Cell>{formatMoney(e.averageIncome)}</Table.Cell>
                            <Table.Cell>{CANDIDATE_APPLICATION_STATUS[e.candidateStatus]}</Table.Cell>
                            <Table.Cell>{findLabel(APPLICATION_STATUS, e.status)}</Table.Cell>
                        </Table.Row>
                    ))
                }
            </Table.Root>
        </>
    )
}