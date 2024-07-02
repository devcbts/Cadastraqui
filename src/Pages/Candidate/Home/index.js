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
    const [data, setData] = useState({ announcements: 0, subscriptions: 0 })
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
                        <Card.Root >
                            <Card.Title text={'suas inscrições'} />
                            <Card.Content>
                                <h1>{data.subscriptions}</h1>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root >
                            <Card.Title text={'solicitações'} />
                            <Card.Content>
                                <h1>0</h1>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root onClick={() => navigate('editais')}>
                            <Card.Title text={'editais do candidato'} />
                            <Card.Content>
                                <h1>{data.announcements}</h1>
                            </Card.Content>
                        </Card.Root>
                    </div>
                    <div className={styles.row}>
                        <Card.Root >
                            <Card.Title text={'despesa média mensal'} />
                            <Card.Content>
                                <h3>{formatMoney(data.avgExpense)}</h3>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root >
                            <Card.Title text={'renda média familiar mensal'} />
                            <Card.Content>
                                <h3>{formatMoney(data.familyIncome)}</h3>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root >
                            <Card.Title text={'salário mínimo nacional'} />
                            <Card.Content>
                                <h3>{formatMoney(1412)}</h3>
                            </Card.Content>
                        </Card.Root>
                        {/* <Card.Root width={230}>
                            <Card.Title text={'elegível a bolsa'} />
                            <Card.Content>
                                <h3>Integral</h3>
                            </Card.Content>
                        </Card.Root> */}
                    </div>
                </div>
                <SubscriptionStatus />
            </div>
        </div>
    )
}