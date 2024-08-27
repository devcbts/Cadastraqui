import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { NotificationService } from "services/notification";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import EDUCATION_TYPE from "utils/enums/education-type";
import styles from './styles.module.scss'
import formatDate from "utils/format-date";
import Loader from "Components/Loader";
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg'
import { ReactComponent as List } from 'Assets/icons/list.svg'
import Card from "Components/Card";
import AssistantManagerAnnouncementReports from "../AnnouncementReports";
export default function AssistantManagerSelectedAnnouncement() {
    const { state } = useLocation()
    const { announcementId } = useParams()
    const navigate = useNavigate()
    const [announcement, setAnnouncement] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        if (!announcementId) {
            NotificationService.error({ text: 'Edital não encontrado' }).then(() => navigate(-1))
        }
        const fetchAnnouncement = async () => {
            setIsLoading(true)
            try {
                const information = await socialAssistantService.getAnnouncementById(announcementId)
                setAnnouncement(information)
            } catch (err) {

                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchAnnouncement()
    }, [announcementId])
    return (
        <>
            <Loader loading={isLoading} />
            <BackPageTitle title={'Gerencial Administrativo'} path={-1} />
            {announcement && <div>
                <div className={styles.informative}>
                    <div className={styles.row}>
                        <div className={styles.spanInstituicao}>
                            <span>Instituição: </span>
                            <label>
                                {announcement.announcement?.entity?.socialReason}
                            </label>
                        </div>
                        <div className={styles.divSpan}>
                            <span className={styles.spanEdital}>
                                Edital:
                            </span>
                            <label>
                                {announcement.announcement.announcementNumber}
                            </label>
                            <span className={styles.spanTotalVagas}>
                                Total de vagas:
                            </span>
                            <label>
                                {announcement.announcement.verifiedScholarships}
                            </label>
                            <span className={styles.spanVigEdital}>
                                Vigência do Edital:
                            </span>
                            <label>
                                {formatDate(announcement.announcement.announcementBegin)} à {formatDate(announcement.announcement.announcementDate, { utc: false })}
                            </label>
                        </div>
                    </div>
                    <div className={styles.divPeriodo}>
                        <span className={styles.spanPerInsc}>
                            Período de Inscrição:</span>
                        <label>
                            {formatDate(announcement.announcement.openDate)} à {formatDate(announcement.announcement.closeDate, { utc: false })}
                        </label>
                    </div>
                </div>
                {!state?.isUnit
                    ? <Table.Root headers={['matriz ou filial/cidade', 'tipo de educação', 'ciclo/ano/série/curso', 'turno', 'ação', 'rel. fim']}>
                        {
                            announcement?.educationLevels.map((educationLevel) => {
                                const { matchedEducationLevels: courses } = educationLevel
                                return courses.map((course) =>
                                (
                                    <Table.Row key={educationLevel.id}>
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
                    : <AssistantManagerAnnouncementReports />
                }
            </div>}
        </>
    )
}