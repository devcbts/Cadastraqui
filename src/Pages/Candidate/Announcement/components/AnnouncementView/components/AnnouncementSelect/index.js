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
export default function AnnouncementSelect() {
    const { announcementId } = useParams()
    const { clear, step, move } = useContext(AnnouncementContext)
    const [announcement, setAnnouncement] = useState(null)
    const [query, _] = useSearchParams()
    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const information = await candidateService.getAnnouncementById(announcementId)
                setAnnouncement(information)
            } catch (err) {

            }
        }
        fetchAnnouncement()
    }, [])
    const getEntityInformation = () => {
        if (announcement) {
            const { name, address, addressNumber, city, neighborhood, UF } = announcement.entity
            return {
                name,
                address: `${address}, Nº ${addressNumber}. ${city} - ${UF}`
            }
        }
    }
    const courseInformation = useMemo(() => announcement?.educationLevels?.find((e) => e.id === query.get('curso')), [announcement])
    return (
        <>
            {step === 'INITIAL'
                ? (
                    <>
                        <BackPageTitle title={'curso selecionado'} onClick={clear} />
                        <div className={styles.content}>
                            <div className={styles.contentwrapper}>
                                <img src={Logo}></img>
                                <div className={styles.info}>
                                    <span>Instituição: {getEntityInformation()?.name}</span>
                                    <span>Endereço: {getEntityInformation()?.address} </span>
                                    <span>Email: unifei@unifei.com</span>
                                </div>
                                <Card.Root width="230px">
                                    <Card.Title text={'curso pretendido'} />
                                    <Card.Content>
                                        <span>{courseInformation?.availableCourses}</span>
                                    </Card.Content>
                                </Card.Root>
                                <div className={styles.cards}>
                                    <Card.Root width="230px">
                                        <Card.Title text={'vagas'} />
                                        <Card.Content>
                                            <span>{courseInformation?.verifiedScholarships}</span>
                                        </Card.Content>
                                    </Card.Root>
                                    <Card.Root width="230px">
                                        <Card.Title text={'semestre'} />
                                        <Card.Content>
                                            <span>{courseInformation?.semester}</span>
                                        </Card.Content>
                                    </Card.Root>
                                    <Card.Root width="230px">
                                        <Card.Title text={'turno'} />
                                        <Card.Content>
                                            <span>{courseInformation?.shift}</span>
                                        </Card.Content>
                                    </Card.Root>
                                    <Card.Root width="230px">
                                        <Card.Title text={'tipo de educação'} />
                                        <Card.Content>
                                            <span>{EDUCATION_TYPE.find(e => e.value === courseInformation?.level)?.label}</span>
                                        </Card.Content>
                                    </Card.Root>
                                    <Card.Root width="230px">
                                        <Card.Title text={'bolsa'} />
                                        <Card.Content>
                                            <span>{EDUCATION_TYPE.find(e => e.value === courseInformation?.level)?.label}</span>
                                        </Card.Content>
                                    </Card.Root>
                                </div>
                            </div>
                            <ButtonBase label={'inscrição'} onClick={() => move('START_SUB')} />
                        </div>
                    </>
                )
                : <Subscription />
            }
        </>
    )
}