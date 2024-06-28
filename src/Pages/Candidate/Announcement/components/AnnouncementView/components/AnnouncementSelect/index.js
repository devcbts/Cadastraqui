import BackPageTitle from "Components/BackPageTitle";
import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import AnnouncementContext from "../../context/announcementContext";
import ButtonBase from "Components/ButtonBase";
import styles from './styles.module.scss'
import Logo from '../../../../../../../Assets/images/logo_primary.png'
import Card from "Components/Card";
import candidateService from "services/candidate/candidateService";
import { useSearchParams } from "react-router-dom";
import SHIFT from "utils/enums/shift-types";
import EDUCATION_TYPE from "utils/enums/education-type";
import Subscription from "../Subscription";
import SCHOLARSHIP_TYPE from "utils/enums/scholarship-type";
import Loader from "Components/Loader";
import { NotificationService } from "services/notification";
import findLabel from "utils/enums/helpers/findLabel";
import SCHOLARSHIP_OFFER from "utils/enums/scholarship-offer";
export default function AnnouncementSelect({ announcement }) {
    const { announcementId } = useParams()
    const { clear, step, move, setCourse, getCourse } = useContext(AnnouncementContext)
    const [announcementInfo, setAnnouncement] = useState(announcement ?? null)
    const [query, _] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    // track if current announcement is saved by user
    // if announcement have any value, we know the user came from the past screen (need to have announcement saved)
    const [isVisited, setIsVisited] = useState(!!announcement)
    useEffect(() => {

        // if user came from an external link, can get the information directly by the course selected
        if (!announcementInfo) {
            const fetchAnnouncement = async () => {
                setIsLoading(true)
                try {
                    console.log('sal ')
                    const information = await candidateService.getAnnouncementById(announcementId)
                    // candidateService.saveAnnouncement(announcementId).catch((_) => { })
                    const savedAnnouncements = await candidateService.getCandidateAnnouncements()
                    setIsVisited(savedAnnouncements?.find((e) => e.announcement.id === information.id))
                    setAnnouncement(information)
                    if (information) {
                        const { apply } = information
                        const currentCourseEntity = apply?.find((e) => e?.courses?.find((course) => course.id === query.get('curso')))
                        setCourse({ ...currentCourseEntity, course: currentCourseEntity.courses.find((e) => e.id === query.get('curso')) })
                    }
                } catch (err) {

                }
                setIsLoading(false)
            }

            fetchAnnouncement()
        }
    }, [])
    const announcementCourse = useMemo(() => {
        if (announcementInfo) {
            const { socialReason, address, addressNumber, city, UF, course } = getCourse
            return {
                socialReason,
                address: `${address}, Nº ${addressNumber}. ${city} - ${UF}`,
                ...course
            }
        }
    }, [announcementInfo, getCourse])
    const handleSaveAnnouncement = async () => {
        try {
            await candidateService.saveAnnouncement(announcementInfo.id)
            setIsVisited(true)
        } catch (err) {
            NotificationService.error({ text: 'Erro ao salvar edital' })
        }
    }
    return (
        <>
            {step === 'INITIAL'
                ? (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Loader text="Carregando informações" loading={isLoading} />
                        <BackPageTitle title={'curso selecionado'} onClick={clear} />
                        <div className={styles.content}>
                            {!isVisited && <div className={styles.save}>
                                <ButtonBase label={'salvar edital'} onClick={handleSaveAnnouncement} />
                            </div>}
                            <div className={styles.contentwrapper}>
                                {announcementInfo?.logo
                                    ? <img src={announcementInfo.logo}></img>
                                    : <img src={Logo}></img>}
                                <div className={styles.info}>
                                    <span>Instituição: {announcementCourse?.socialReason}</span>
                                    <span>Endereço: {announcementCourse?.address} </span>
                                    <span>Email: unifei@unifei.com</span>
                                </div>
                                <Card.Root width="230px">
                                    <Card.Title text={'curso/série pretendida'} />
                                    <Card.Content>
                                        <span>{announcementCourse?.availableCourses ?? announcementCourse?.grade}</span>
                                    </Card.Content>
                                </Card.Root>
                                <div className={styles.cards}>
                                    <Card.Root width="230px">
                                        <Card.Title text={'vagas'} />
                                        <Card.Content>
                                            <span>{announcementCourse?.verifiedScholarships}</span>
                                        </Card.Content>
                                    </Card.Root>
                                    {/* <Card.Root width="230px">
                                        <Card.Title text={'semestre'} />
                                        <Card.Content>
                                            <span>{announcementCourse?.semester}</span>
                                        </Card.Content>
                                    </Card.Root> */}
                                    <Card.Root width="230px">
                                        <Card.Title text={'turno'} />
                                        <Card.Content>
                                            <span>{announcementCourse?.shift}</span>
                                        </Card.Content>
                                    </Card.Root>
                                    <Card.Root width="230px">
                                        <Card.Title text={'tipo de educação'} />
                                        <Card.Content>
                                            <span>{EDUCATION_TYPE.find(e => e.value === announcementCourse?.level)?.label}</span>
                                        </Card.Content>
                                    </Card.Root>
                                    <Card.Root width="230px">
                                        <Card.Title text={'bolsa'} />
                                        <Card.Content>
                                            <span>{
                                                findLabel(SCHOLARSHIP_TYPE, announcementCourse?.higherEduScholarshipType)
                                                ?? findLabel(SCHOLARSHIP_OFFER, announcementCourse?.scholarshipType)
                                            }</span>
                                        </Card.Content>
                                    </Card.Root>
                                </div>
                            </div>
                            <ButtonBase label={'inscrição'} onClick={() => move('START_SUB')} />
                        </div>
                    </div>
                )
                : <Subscription />
            }
        </>
    )
}