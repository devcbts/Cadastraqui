import IndicatorChart from "Components/Announcement/InterestCards/IndicatorChart";
import ButtonBase from "Components/ButtonBase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AIService from "services/AI/AIService";
import { AI_STATUS, AI_STATUS_TRANSLATION } from "utils/enums/ai-status-type";
import { ReactComponent as Help } from 'Assets/icons/question-mark.svg'
import { AnimatePresence, motion } from "framer-motion";
const CURRENT_AI_STATUS = {
    [AI_STATUS.RELIABLE]: (<>
        Análise Conclusiva e Confiável (Verde):
        <ul>
            <li>⁠ ⁠Percentual de análise conclusiva acima de 80%.</li>
            <li>⁠ ⁠Nenhuma inconsistência encontrada nos dados.</li>
            <li>Este status indica que a análise é confiável e pode ser utilizada com segurança para um parecer final.</li>
        </ul>
    </>),
    [AI_STATUS.LESS_RELIABLE]: (<>
        Análise Parcial e Pouco Confiável (Amarelo):
        <ul>
            <li>⁠ Percentual de análise conclusiva entre 50% e 79%.</li>
            <li>⁠ ⁠No máximo três inconsistência encontrada.</li>
            <li>⁠Esse status sugere uma análise parcial, necessitando de revisão, pois há margem para incertezas.</li>
        </ul>
    </>),
    [AI_STATUS.UNRELIABLE]: (<>
        Análise Inconclusiva e Não Confiável (Vermelho):
        <ul>
            <li>⁠Percentual de análise conclusiva abaixo de 50% ou com quatro ou mais inconsistências detectadas.</li>
            <li>⁠⁠Este status indica uma análise insuficiente ou com problemas significativos, recomendando atenção e revisão detalhada antes de qualquer decisão.</li>
        </ul>
    </>),

}
export default function ChartAI({
    applicationId,
    children
}) {
    const [data, setData] = useState(null)
    const [showDetails, setShowDetails] = useState(false)
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
                <p style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>Status da análise:
                    <strong
                        onClick={() => setShowDetails(prev => !prev)}
                        style={{ display: 'flex', alignItems: "center", gap: '8px', cursor: 'pointer' }}>{AI_STATUS_TRANSLATION[data?.status]} <Help height={25} /></strong>
                </p>
                {children}
                <AnimatePresence>
                    {showDetails && <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        transition={{ duration: .5 }}
                    >
                        <div style={{ padding: '24px' }}>
                            {CURRENT_AI_STATUS[data?.status]}
                        </div>
                    </motion.div>}
                </AnimatePresence>
            </div>
        </div>
    )
}