import Card from "Components/Card"
import { useLocation, useNavigate } from "react-router"
import TotalOrPartialReport from "../Reports/TotalOrPartial"
import NominalReport from "../Reports/Nominal"
import AssistantManagerBenefits from "../Benefits"

export default function AssistantManagerAnnouncementReports() {
    const { state } = useLocation()
    const navigate = useNavigate()
    return (
        <>
            {
                !state?.reportType && (
                    <div>

                        <h3>Relatórios</h3>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', marginTop: '32px' }}>
                            <Card.Root onClick={() => navigate('', { state: { ...state, reportType: 'default' } })}>
                                <Card.Title text={'geral ou parcial'} />
                            </Card.Root>
                            <Card.Root onClick={() => navigate('', { state: { ...state, reportType: 'nominal' } })}>
                                <Card.Title text={'nominal de bolsistas'} />
                            </Card.Root>
                            <Card.Root onClick={() => navigate('', { state: { ...state, reportType: 'benefits' } })}>
                                <Card.Title text={'tipo de benefícios'} />
                            </Card.Root>
                        </div>
                    </div>
                )
            }
            {
                state?.reportType === 'default' && <TotalOrPartialReport />
            }
            {
                state?.reportType === 'nominal' && <NominalReport />
            }
            {
                state?.reportType === 'benefits' && <AssistantManagerBenefits />
            }

        </>
    )
}