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
                setData(Object.entries(progress).filter(([key]) => sections.some(e => e.name === key)).map(([key, val]) => ({ name: key, value: val ? 1 : 0 })))
            } catch (err) { }
        }
        fetchProgress()
    }, [])
    const sections = [
        { name: 'cadastrante', icon: User, percentage: 20, title: 'Cadastrante' },
        { name: 'grupoFamiliar', icon: Family, percentage: 20, title: 'Grupo familiar' },
        { name: 'moradia', icon: House, percentage: 5, title: 'Moradia' },
        { name: 'veiculos', icon: Car, percentage: 5, title: 'Veículos' },
        { name: 'rendaMensal', icon: Currency, percentage: 20, title: 'Renda' },
        { name: 'despesas', icon: Money, percentage: 10, title: 'Despesas' },
        { name: 'saude', icon: Doctor, percentage: 5, title: 'Saúde' },
        { name: 'declaracoes', icon: List, percentage: 15, title: 'Declarações' },
    ]
    const percentage = data?.reduce((acc, e) => {
        return acc += Number((sections?.find(i => i.name === e.name)?.percentage ?? 0) * e.value)
    }, 0)
    return (
        <div className={styles.container}>
            <div className={styles.progress}>

                <div style={{ position: 'relative' }}>

                    <span style={{ position: 'absolute', top: '50%', right: '50%', transform: 'translate(50%,-50%)' }}> {percentage}%</span>

                    <PieChart width={100} height={100} title={`O cadastro está ${percentage}% concluído`} className={styles.graph}>
                        <Pie
                            data={data}
                            dataKey={"value"}
                            innerRadius={38}
                            outerRadius={50}
                            paddingAngle={0}
                            startAngle={90}
                            endAngle={(percentage * 3.6) + 90}
                            fill='#1F4B73'
                            direction={'right'}
                        >
                        </Pie>
                    </PieChart>

                </div>
                <span>Situação do cadastro: {percentage < 100 ? 'Incompleto' : 'Completo'}</span>
            </div>
            <div className={styles.registerinfo}>
                <div className={styles.registerdesc}>
                    <h1>Preenchimento do Cadastro</h1>
                    <span>Complete seu cadastro para se inscrever e começar a desfrutar de todos os benefícios de uma educação de qualidade!</span>
                </div>
                <div className={styles.sections}>
                    {sections.map(({ icon, name, title }, index) => {
                        const Component = icon
                        const step = index + 1
                        return (
                            <Component
                                key={index}
                                tabIndex={0}
                                aria-label={title}
                                title={`${title} - ${!!data?.find(e => e.name === name)?.value ? 'completo' : 'incompleto'}`}
                                style={{ cursor: 'pointer', color: !!data?.find(e => e.name === name)?.value && '#499468', clipPath: 'circle()' }}
                                onClick={() => navigate('/formulario-inscricao', { state: { step } })}
                                height={30}
                                width={30}
                                color='#1F4B73'
                            />
                        )
                    })}

                </div>
            </div>

        </div>
    )
}