import { ReactComponent as Car } from 'Assets/icons/car.svg';
import { ReactComponent as Currency } from 'Assets/icons/currency.svg';
import { ReactComponent as Doctor } from 'Assets/icons/doctor.svg';
import { ReactComponent as Family } from 'Assets/icons/family.svg';
import { ReactComponent as House } from 'Assets/icons/house.svg';
import { ReactComponent as List } from 'Assets/icons/list.svg';
import { ReactComponent as Money } from 'Assets/icons/money.svg';
import { ReactComponent as User } from 'Assets/icons/user.svg';
import { useEffect, useState } from 'react';
import { Pie, PieChart } from 'recharts';
import candidateService from 'services/candidate/candidateService';
import styles from './styles.module.scss';
import { useNavigate } from 'react-router';

export default function SubscriptionStatus() {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const max = 8
    const percentage = data?.filter((e) => e.value === 1).length / max
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const progress = await candidateService.getProgress()
                console.log(progress)
                setData(Object.entries(progress).map(([key, val]) => ({ name: key, value: val ? 1 : 0 })))
            } catch (err) { }
        }
        fetchProgress()
    }, [])
    const icons = [
        { name: 'cadastrante', icon: User },
        { name: 'grupoFamiliar', icon: Family },
        { name: 'moradia', icon: House },
        { name: 'veiculos', icon: Car },
        { name: 'rendaMensal', icon: Currency },
        { name: 'despesas', icon: Money },
        { name: 'saude', icon: Doctor },
        { name: 'declaracoes', icon: List },
    ]
    return (
        <div className={styles.container}>
            <span>Situação do cadastro: {percentage < 1 ? 'Incompleto' : 'Completo'}</span>
            <div className={styles.chartwrapper}>
                <h1>Preenchimento do Cadastro</h1>
                <div className={styles.chartdisplay}>
                    <span>Complete seu cadastro, para se inscrever e começar a desfrutar de todos os benefícios de uma educação de qualidade!</span>
                    <div style={{ position: 'relative' }}>

                        <span style={{ position: 'absolute', top: '50%', right: '50%', transform: 'translate(50%,-50%)' }}> {percentage * 100}%</span>
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