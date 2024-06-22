import { useEffect, useState } from "react"
import Card from "Components/Card"
import SubscriptionStatus from "./components/SubscriptionStatus"
import { useNavigate } from "react-router"
import styles from './styles.module.scss'
import candidateService from "services/candidate/candidateService"
export default function HomeCandidate() {
    const navigate = useNavigate()
    const [data, setData] = useState({ announcements: 0, subscriptions: 0 })
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const information = await candidateService.getDashboard()
                setData(information)
            } catch (err) { }
        }
        fetchDashboard()
    }, [])
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Início</h1>
            <div className={styles.informative}>
                <div className={styles.column}>
                    <div className={styles.row}>
                        <Card.Root width={230}>
                            <Card.Title text={'suas inscrições'} />
                            <Card.Content>
                                <h1>{data.subscriptions}</h1>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root width={230}>
                            <Card.Title text={'solicitações'} />
                            <Card.Content>
                                <h1>0</h1>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root width={230} onClick={() => navigate('editais')}>
                            <Card.Title text={'editais do candidato'} />
                            <Card.Content>
                                <h1>{data.announcements}</h1>
                            </Card.Content>
                        </Card.Root>
                    </div>
                    <div className={styles.row}>
                        <Card.Root width={230}>
                            <Card.Title text={'renda bruta mensal'} />
                            <Card.Content>
                                <h3>R$1400</h3>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root width={230}>
                            <Card.Title text={'renda bruta familiar mensal'} />
                            <Card.Content>
                                <h3>R$1250</h3>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root width={230}>
                            <Card.Title text={'salário mínimo nacional'} />
                            <Card.Content>
                                <h3>R$1412</h3>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root width={230}>
                            <Card.Title text={'elegível a bolsa'} />
                            <Card.Content>
                                <h3>Integral</h3>
                            </Card.Content>
                        </Card.Root>
                    </div>
                </div>
                <SubscriptionStatus />
            </div>
        </div>
    )
}