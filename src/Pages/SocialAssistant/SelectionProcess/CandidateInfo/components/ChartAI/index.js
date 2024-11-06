import IndicatorChart from "Components/Announcement/InterestCards/IndicatorChart";
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AIService from "services/AI/AIService";

export default function ChartAI({
    applicationId,
    children
}) {
    const [data, setData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const information = await AIService.getReliabilityByApplication(applicationId)
                setData(information.analysisStatus)
            } catch (err) {

            }
        }
        fetchData()
    }, [applicationId])
    // if (!data || JSON.stringify(data) === '{}') {
    //     return <h4>Nenhuma análise disponível</h4>
    // }
    return (
        <div>
            <h4>Índice de confiança</h4>
            <IndicatorChart
                data={[
                    // 0 - 49
                    { value: 49, color: 'red', legend: 'Mais de uma inconsistência ou inconsistência grave' },
                    // 50 - 79
                    { value: 30, color: 'gold', legend: 'Até uma inconsistência' },
                    // 80 - 100
                    { value: 21, color: 'green', legend: 'Nenhuma inconsistência' },
                ]}
                value={data?.percentage}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                <p>Status da análise: <strong>{data?.status}</strong></p>
                {children}

            </div>
        </div>
    )
}