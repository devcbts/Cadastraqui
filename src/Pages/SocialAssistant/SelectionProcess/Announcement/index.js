import { ReactComponent as List } from 'Assets/icons/list.svg';
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg';
import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Loader from "Components/Loader";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import EDUCATION_TYPE from "utils/enums/education-type";
import formatDate from "utils/format-date";
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
export default function SocialAssistantAnnouncement() {
    const navigate = useNavigate()
    const { announcementId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [process, setProcess] = useState({ announcement: {}, educationLevels: [], url: '' })
    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                setIsLoading(true)
                const information = await socialAssistantService.getAnnouncementById(announcementId)
                setProcess(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchAnnouncement()
    }, [announcementId])
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Processo de seleção'} path={'/processos'} />
            <div style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>

                <div className={styles.informative}>
                    <div className={styles.row}>
                        <div className={styles.spanInstituicao}>
                            <span>Instituição: </span>
                            <label>
                                {process.announcement?.entity?.socialReason}
                            </label>
                        </div>
                        <div className={styles.divSpan}>
                            <span className={styles.spanEdital}>
                                Edital:
                            </span>
                            <label>
                                {process.announcement.announcementNumber}
                            </label>
                            <span className={styles.spanTotalVagas}>
                                Total de vagas:
                            </span>
                            <label>
                                {process.announcement.verifiedScholarships}
                            </label>
                            <span className={styles.spanVigEdital}>
                                Vigência do Edital:
                            </span>
                            <label>
                                {formatDate(process.announcement.announcementBegin)} à {formatDate(process.announcement.announcementDate)}
                            </label>
                        </div>
                    </div>
                    <div className={styles.divPeriodo}>
                        <span className={styles.spanPerInsc}>
                            Período de Inscrição:</span>
                        <label>
                            {formatDate(process.announcement.openDate)} à {formatDate(process.announcement.closeDate)}
                        </label>
                    </div>
                    {
                        process?.announcement?.interview !== null &&
                        <div className={styles.divPeriodo}>
                            <span className={styles.spanPerInsc}>
                                Período de Avaliação:</span>
                            <label>
                                {formatDate(process?.announcement?.interview?.startDate)} à {formatDate(process?.announcement?.interview?.endDate)}
                            </label>
                        </div>
                    }
                </div>
                <Link to={process.url} target='_blank'>
                    <ButtonBase label={'visualizar PDF'} />
                </Link>

            </div>
            <Table.Root headers={['matriz ou filial/cidade', 'tipo de educação', 'ciclo/ano/série/curso', 'turno', 'ação', 'rel. fim']}>
                {
                    process.educationLevels.map((educationLevel) => {
                        const { matchedEducationLevels: courses } = educationLevel
                        return courses.map((course) =>
                        (
                            <Table.Row>
                                <Table.Cell>{course.entity}</Table.Cell>
                                <Table.Cell>{EDUCATION_TYPE.find(e => e.value === course.education)?.label}</Table.Cell>
                                <Table.Cell>{course.availableCourse ?? course.grade}</Table.Cell>
                                <Table.Cell>{course.shift}</Table.Cell>
                                <Table.Cell>
                                    <ButtonBase onClick={() => navigate(course.id)}>
                                        <Magnifier width={14} height={14} />
                                    </ButtonBase>
                                </Table.Cell>
                                <Table.Cell>
                                    <ButtonBase>
                                        <List width={14} height={14} />
                                    </ButtonBase>
                                </Table.Cell>
                            </Table.Row>
                        )
                        )

                    })
                }
            </Table.Root>
        </>
    )
}