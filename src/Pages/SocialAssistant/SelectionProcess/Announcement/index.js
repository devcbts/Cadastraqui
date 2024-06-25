import BackPageTitle from "Components/BackPageTitle";
import styles from './styles.module.scss'
import Table from "Components/Table";
import ButtonBase from "Components/ButtonBase";
import { ReactComponent as Magnifier } from 'Assets/icons/magnifier.svg'
import { ReactComponent as List } from 'Assets/icons/list.svg'
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import formatDate from "utils/format-date";
import EDUCATION_TYPE from "utils/enums/education-type";
import SCHOOL_LEVELS from "utils/enums/school-levels";
import Loader from "Components/Loader";
export default function SocialAssistantAnnouncement() {
    const navigate = useNavigate()
    const { announcementId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [process, setProcess] = useState({ announcement: {}, educationLevels: [] })
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
            <BackPageTitle title={'processo de seleção'} path={'/home'} />
            <div className={styles.informative}>
                <div className={styles.row}>
                    <span>Instituição: {process.announcement?.entity?.socialReason}</span>
                    <span>Edital: {process.announcement.announcementNumber}</span>
                    <span>Total de vagas: {process.announcement.verifiedScholarships} </span>
                </div>
                <span>Vigência do Edital: {formatDate(process.announcement.announcementDate)}</span>
                <span>Período de Inscrição: {formatDate(process.announcement.openDate)} à {formatDate(process.announcement.closeDate)}</span>
                {/* <span>Período de Avaliação: 21/05/2024 à 20/06/2024</span> */}
            </div>
            <Table.Root headers={['matriz ou filial/cidade', 'tipo de educação', 'ciclo/ano/série/curso', 'turno', 'ação', 'rel. fim']}>
                {
                    process.educationLevels.map((educationLevel) => {
                        const { matchedEducationLevels: courses } = educationLevel
                        return courses.map((course) =>
                        (
                            <Table.Row>
                                <Table.Cell>{course.entity}</Table.Cell>
                                <Table.Cell>{SCHOOL_LEVELS.find(e => e.value === course.education)?.label}</Table.Cell>
                                <Table.Cell>{course.grade}</Table.Cell>
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