import { useLocation } from "react-router"
import AllCandidatesBenefitsTypeTwo from "./components/AllCandidates"
import SelectedCandidateBenefitsTypeTwo from "./components/SelectedCandidate"

export default function BenefitsTypeTwo() {
    const { state } = useLocation()
    return (
        <div>
            <h2 style={{ textAlign: 'center' }}>Benefícios Tipo 2</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                <label>Cód. instituição no censo: 123123123</label>
                <label>Especificação da ação de apoio: 123123123</label>
            </div>
            {
                !state?.candidateId &&
                <AllCandidatesBenefitsTypeTwo />
            }
            {
                state?.candidateId &&
                <SelectedCandidateBenefitsTypeTwo />
            }
        </div>
    )
}