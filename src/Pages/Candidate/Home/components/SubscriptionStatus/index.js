import { Pie, PieChart } from 'recharts'
import styles from './styles.module.scss'
import { ReactComponent as User } from 'Assets/icons/user.svg';
import { ReactComponent as House } from 'Assets/icons/house.svg';
import { ReactComponent as Family } from 'Assets/icons/family.svg';
import { ReactComponent as Car } from 'Assets/icons/car.svg';
import { ReactComponent as Currency } from 'Assets/icons/currency.svg';
import { ReactComponent as Money } from 'Assets/icons/money.svg';
import { ReactComponent as Doctor } from 'Assets/icons/doctor.svg';
import { ReactComponent as List } from 'Assets/icons/list.svg';
import { ReactComponent as Edit } from 'Assets/icons/edit.svg';
const data = [
    { value: 1, },
    { value: 0, },
    { value: 1, },
    { value: 0, },
    { value: 1, },
    { value: 1, },
    { value: 0, },
    { value: 0, },
]
const max = 8
const percentage = data.filter((e) => e.value === 1).length / max
export default function SubscriptionStatus() {
    const icons = [User,
        House,
        Family,
        Car,
        Currency,
        Money,
        Doctor,
        List,
        Edit]
    return (
        <div className={styles.container}>
            <span>Situação do cadastro: Incompleto</span>
            <div className={styles.chartwrapper}>
                <h1>Preenchimento do Cadastro</h1>
                <div className={styles.chartdisplay}>
                    <span>Complete seu cadastro, para se inscrever e começar a desfrutar de todos os benefícios de uma educação de qualidade!</span>
                    <PieChart width={100} height={100} >
                        <Pie
                            data={data}
                            dataKey={"value"}
                            innerRadius={40}
                            outerRadius={50}
                            paddingAngle={0}
                            startAngle={90}
                            endAngle={(percentage * 360) + 90}
                            fill='#1F4B73'
                            className={styles.chart}
                            direction={'right'}
                        >
                            <span className={styles.percent}>25%</span>
                        </Pie>
                    </PieChart>
                </div>
            </div>
            <div className={styles.sections}>
                {icons.map((icon, index) => {
                    const Component = icon
                    return (
                        <Component key={index} height={50} width={50} color='#1F4B73' />
                    )
                })}

            </div>
        </div>
    )
}