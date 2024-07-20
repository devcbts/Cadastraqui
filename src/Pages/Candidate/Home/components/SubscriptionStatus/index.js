import { ReactComponent as Car } from 'Assets/icons/car.svg';
import { ReactComponent as Currency } from 'Assets/icons/currency.svg';
import { ReactComponent as Doctor } from 'Assets/icons/doctor.svg';
import { ReactComponent as Family } from 'Assets/icons/family.svg';
import { ReactComponent as House } from 'Assets/icons/house.svg';
import { ReactComponent as List } from 'Assets/icons/list.svg';
import { ReactComponent as Money } from 'Assets/icons/money.svg';
import { ReactComponent as User } from 'Assets/icons/user.svg';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Pie, PieChart } from 'recharts';
import candidateService from 'services/candidate/candidateService';
import styles from './styles.module.scss';

export default function SubscriptionStatus() {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const max = 8

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const progress = await candidateService.getProgress()
                setData(Object.entries(progress).map(([key, val]) => ({ name: key, value: val ? 1 : 0 })))
            } catch (err) { }
        }
        fetchProgress()
    }, [])
    const icons = [
        { name: 'cadastrante', icon: User, percentage: 20 },
        { name: 'grupoFamiliar', icon: Family, percentage: 20 },
        { name: 'moradia', icon: House, percentage: 5 },
        { name: 'veiculos', icon: Car, percentage: 5 },
        { name: 'rendaMensal', icon: Currency, percentage: 20 },
        { name: 'despesas', icon: Money, percentage: 10 },
        { name: 'saude', icon: Doctor, percentage: 5 },
        { name: 'declaracoes', icon: List, percentage: 15 },
    ]
    const percentage = data?.reduce((acc, e) => {
        return acc += Number((icons?.find(i => i.name === e.name)?.percentage ?? 0) * e.value)
    }, 0)
    return (
        <div className={styles.container}>
            <span>Situação do cadastro: {percentage < 100 ? 'Incompleto' : 'Completo'}</span>
            <div className={styles.chartwrapper}>
                <h1>Preenchimento do Cadastro</h1>
                <div className={styles.chartdisplay}>
                    <span>Complete seu cadastro, para se inscrever e começar a desfrutar de todos os benefícios de uma educação de qualidade!</span>
                    <div style={{ position: 'relative' }}>

                        <span style={{ position: 'absolute', top: '50%', right: '50%', transform: 'translate(50%,-50%)' }}> {percentage}%</span>
                        <PieChart width={100} height={100} >
                            <Pie
                                data={data}
                                dataKey={"value"}
                                innerRadius={38}
                                outerRadius={50}
                                paddingAngle={0}
                                startAngle={90}
                                endAngle={(percentage * 3.6) + 90}
                                fill='#1F4B73'
                                className={styles.chart}
                                direction={'right'}
                            >
                            </Pie>
                        </PieChart>
                    </div>
                </div>
            </div>
            <div className={styles.sections}>
                {icons.map(({ icon, name }, index) => {
                    const Component = icon
                    const step = index + 1
                    return (
                        <Component
                            key={index}
                            style={{ cursor: 'pointer', color: !!data?.find(e => e.name === name)?.value && '#499468' }}
                            onClick={() => navigate('/formulario-inscricao', { state: { step } })}
                            height={50}
                            width={50}
                            color='#1F4B73'
                        />
                    )
                })}

            </div>
        </div>
    )
}