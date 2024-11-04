import Card from "Components/Card/CardRoot";
import { useEffect, useState } from "react";
import entityService from "services/entity/entityService";
import styles from './styles.module.scss'
import IndicatorChart from "./IndicatorChart";
// ({candidateInterest}) => Element
export default function InterestCards({
    announcementId,
    children = null
}) {
    const [data, setData] = useState({
        numberOfInterested: 0,
        numberOfApplications: 0,
        numberOfFinishedRegistration: 0,
        numberOfUnfinishedRegistration: 0,
        candidateInterest: []
    })
    useEffect(() => {
        const fetchInterest = async () => {
            try {
                const information = await entityService.getAnnouncementInterests(announcementId)
                setData(information)
            } catch (err) {
            }
        }
        if (announcementId) { fetchInterest() }
    }, [announcementId])
    if (!announcementId) return null
    return (
        <>
            <div className={styles.container}>
                <Card title={'interessados'}>{data.numberOfInterested}</Card>
                <Card title={'cadastro completo'}>{data.numberOfFinishedRegistration}</Card>
                <Card title={'cadastro incompleto'}>{data.numberOfUnfinishedRegistration}</Card>
                <Card title={'inscritos'}>{data.numberOfApplications}</Card>
            </div>

            <h3>Taxa de conversão de Candidatos interessados em inscritos</h3>
            <IndicatorChart
                data={[
                    { value: 20, color: '#FF4C4C', legend: 'Ruim - 0% à 20%' },
                    { value: 20, color: '#FFA500', legend: 'Abaixo do esperado - 21% à 40%' },
                    { value: 20, color: '#FFD700', legend: 'Moderado - 41% à 60%' },
                    { value: 20, color: '#55F43E', legend: 'Bom - 61% à 80%' },
                    { value: 20, color: '#26C90C', legend: 'Excelente - 81% à 100%' },
                ]}
                value={(data.numberOfApplications / data?.numberOfInterested) * 100}
            />
            {
                children && (
                    <div style={{ marginTop: '24px' }}>
                        {children({ candidateInterest: data?.candidateInterest })}
                    </div>
                )
            }
        </>
    )
}