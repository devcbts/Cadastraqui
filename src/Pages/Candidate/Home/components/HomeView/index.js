import Card from 'Components/Card'
import styles from './styles.module.scss'
import SubscriptionStatus from '../SubscriptionStatus'
import { useNavigate } from 'react-router'
export default function HomeView() {
    const navigate = useNavigate()
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Início</h1>
            <div className={styles.informative}>
                <div className={styles.column}>
                    <div className={styles.row}>
                        <Card.Root width={230}>
                            <Card.Title text={'suas inscrições'} />
                            <Card.Content>
                                <h1>1</h1>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root width={230}>
                            <Card.Title text={'solicitações'} />
                            <Card.Content>
                                <h1>0</h1>
                            </Card.Content>
                        </Card.Root>
                        <Card.Root onClick={() => navigate('candidate-announcements')}>
                            <Card.Title text={'editais do candidato'} />
                            <Card.Content>
                                <h1>0</h1>
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