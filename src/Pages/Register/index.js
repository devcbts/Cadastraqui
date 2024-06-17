import Logo from 'Assets/images/logo_white.png'
import { ReactComponent as IconLogo } from 'Assets/icons/logo.svg'
import styles from './styles.module.scss'
import { useState } from 'react'
import useStepFormHook from 'Pages/SubscribeForm/hooks/useStepFormHook'
import Personal from './components/PersonalInfo'
import LoginInfo from './components/LoginInfo'
import AddressInfo from './components/AddressInfo'
import { NotificationService } from 'services/notification'
import { useNavigate } from 'react-router'
import candidateService from 'services/candidate/candidateService'
export default function Register() {
    const [current, setCurrent] = useState(0)
    const [data, setData] = useState({ role: "CANDIDATE" })
    const navigate = useNavigate()
    const handleRegister = async (data) => {
        try {
            if (data.role === "CANDIDATE") {
                await candidateService.register(data)
            }
            NotificationService.success({ text: 'Cadastro realizado com sucesso' }).then(() => {
                navigate('/')
            })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    const handleSection = async (form) => {
        setData((prev) => ({ ...prev, ...form }))
        if (current !== 2) {
            setCurrent((prev) => prev + 1)
            return
        }
        console.log('passo')
        await handleRegister({ ...data, ...form })
    }
    const handleBack = (form) => {
        setData((prev) => ({ ...prev, ...form }))
        setCurrent((prev) => prev - 1)
    }
    return (
        <div>
            {/* <Loader loading={!!loading} text={loading} /> */}
            <header style={{ height: '80px', backgroundColor: '#1F4B73', display: 'flex', flexDirection: 'row', justifyContent: 'start', padding: '0 40px', alignItems: 'center' }}>
                <img className={styles.logo} src={Logo} />
            </header>
            <div className={styles.content}>
                <div className={styles.brand}>
                    <IconLogo />
                    <h1>
                        Facilite o processo de concessão
                        de bolsas de estudos
                        para o CEBAS
                    </h1>
                </div>
                {
                    [
                        <Personal data={data} onSubmit={handleSection} />,
                        <LoginInfo data={data} onBack={handleBack} onSubmit={handleSection} />,
                        <AddressInfo data={data} onBack={handleBack} onSubmit={handleSection} />,
                    ][current]

                }
            </div>
        </div>
    )
}