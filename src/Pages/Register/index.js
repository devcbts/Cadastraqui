import { ReactComponent as IconLogo } from 'Assets/icons/logo.svg'
import Logo from 'Assets/images/logo_white.png'
import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import candidateService from 'services/candidate/candidateService'
import { NotificationService } from 'services/notification'
import AddressInfo from './components/AddressInfo'
import LoginInfo from './components/LoginInfo'
import Personal from './components/PersonalInfo'
import UserType from './components/UserType'
import styles from './styles.module.scss'
import ButtonBase from 'Components/ButtonBase'
import Loader from 'Components/Loader'
export default function Register() {
    const [current, setCurrent] = useState(0)
    const { state } = useLocation()
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const handleRegister = async (data) => {
        try {
            setIsLoading(true)
            if (data.role === "candidate") {
                await candidateService.register(data)
            } else {
                await candidateService.registerResponsible(data)
            }
            NotificationService.success({ text: 'Cadastro realizado com sucesso' }).then(() => {
                // if (state.announcementId) {
                //     navigate(`/edital/${state.announcementId}`, { state: {} })
                //     return
                // }
                navigate('/', { state })
            })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
        setIsLoading(false)
    }
    const handleSection = async (form) => {
        setData((prev) => ({ ...prev, ...form }))
        if (current !== 2) {
            setCurrent((prev) => prev + 1)
            return
        }
        await handleRegister({ ...data, ...form })
    }
    const handleBack = (form) => {
        setData((prev) => ({ ...prev, ...form }))
        setCurrent((prev) => prev - 1)
    }
    return (
        <div>
            <Loader loading={isLoading} />
            <header style={{ height: '80px', backgroundColor: '#1F4B73', display: 'flex', flexDirection: 'row', justifyContent: 'start', padding: '0 40px', alignItems: 'center' }}>
                <img className={styles.logo} src={Logo} alt='logo' />
            </header>
            <div className={styles.content}>
                <div className={styles.brand}>
                    <IconLogo />
                    <h1>
                        Facilite o processo de concessão
                        de bolsas de estudos
                        para o CEBAS
                    </h1>
                    <ButtonBase label={'já tem uma conta?'} onClick={() => navigate('/')} />
                </div>
                {
                    [
                        <Personal data={data} onSubmit={handleSection} />,
                        <LoginInfo data={data} onBack={handleBack} onSubmit={handleSection} />,
                        // <AddressInfo className={styles.address} data={data} onBack={handleBack} onSubmit={handleSection} />,
                        <UserType data={data} onBack={handleBack} onSubmit={handleSection} />,
                    ][current]

                }
            </div>
        </div>
    )
}