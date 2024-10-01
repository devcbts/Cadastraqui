import ButtonBase from "Components/ButtonBase";
import Card from "Components/Card";
import { useNavigate } from "react-router";

export default function AssistantManagement() {
    const navigate = useNavigate()
    return (
        < >
            <h1>Gerencial Administrativo</h1>
            <div style={{ marginTop: '64px' }}>

                <h3>Relatórios</h3>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', marginTop: '32px' }}>

                    <Card onClick={() => navigate('editais')} title={'Qualitativo e quantitativo'} />
                    <Card onClick={() => navigate('editais', { state: { isUnit: true } })} title={'Por campus/unidade'} />
                </div>
            </div>
        </ >
    )
}