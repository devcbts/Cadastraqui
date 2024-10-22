import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import Card from "Components/Card/CardRoot";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import entityService from "services/entity/entityService";
import studentService from "services/student/studentService";

export default function StudentsRenewDashboard() {
    const navigate = useNavigate()
    const [data, setData] = useState({ renewAnnouncements: 0, totalScholarships: 0 })
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const information = await studentService.getRenewDashboard()
                setData(information)
            } catch (err) {

            }
        }
        fetchDashboard()
    }, [])
    return (
        <>
            <BackPageTitle title={'Renovação'} path={-1} />
            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', marginBottom: '64px' }}>
                    <Card title={'editais de renovação'} >{data.renewAnnouncements}</Card>
                    <Card title={'bolsas'} >{data.totalScholarships}</Card>
                    {/* <Card title={'bolsas renovadas'} >{'aiodsh'}</Card>
                    <Card title={'renovações pendentes'} >{'aiodsh'}</Card> */}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'center' }}>
                    <h3>Processo de renovação</h3>
                    <ButtonBase label={'começar'} onClick={() => navigate('', { state: { renewProcess: true } })} />
                </div>
            </div>
        </>
    )
}