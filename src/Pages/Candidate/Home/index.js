import Card from "Components/Card"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import candidateService from "services/candidate/candidateService"
import formatMoney from "utils/format-money"
import SubscriptionStatus from "./components/SubscriptionStatus"
import styles from './styles.module.scss'
import Loader from "Components/Loader"
export default function HomeCandidate() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({ announcements: 0, subscriptions: 0, pendencies: 0 })
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getDashboard()
                setData(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchDashboard()
    }, [])
    return (
        <div className={styles.container}>
            <Loader loading={isLoading} />
            <h1 className={styles.title}>Início</h1>
            <div className={styles.informative}>
                <div className={styles.column}>
                    <div className={styles.row}>
                        <Card title={'suas inscrições'}>
                            {data.subscriptions}
                        </Card>
                        <Card onClick={() => navigate('/solicitacoes')} title={'solicitações'}>
                            {data.pendencies}

                        </Card>
                        <Card onClick={() => navigate('editais')} title={'editais do candidato'}>
                            {data.announcements}
                        </Card>
                    </div>
                    <div className={styles.row}>
                        <Card title={'despesa média mensal'}>

                            {formatMoney(data.avgExpense)}

                        </Card>
                        <Card title={'renda média familiar mensal'}>
                            {formatMoney(data.familyIncome)}
                        </Card>
                        <Card title={'salário mínimo nacional'}>
                            {formatMoney(1412)}
                        </Card>

                    </div>
                </div>
                <SubscriptionStatus />
            </div>
        </div>
    )
}