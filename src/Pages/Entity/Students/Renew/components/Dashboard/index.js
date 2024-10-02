import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import { useNavigate } from "react-router";

export default function EntityStudentsRenewDashboard() {
    const navigate = useNavigate()
    return (
        <>
            <BackPageTitle title={'Renovação'} path={-1} />
            <div style={{ padding: '24px' }}>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                    <h3>Processo de renovação</h3>
                    <ButtonBase label={'começar'} onClick={() => navigate('', { state: { renewProcess: true } })} />
                </div>
            </div>
        </>
    )
}