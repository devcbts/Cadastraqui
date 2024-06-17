import Logo from 'Assets/images/logo_white.png'
import { ReactComponent as IconLogo } from 'Assets/icons/logo.svg'
import styles from './styles.module.scss'
import InputForm from 'Components/InputForm'
import useAuth from 'hooks/useAuth'
import { NotificationService } from 'services/notification'
import { useNavigate } from 'react-router'
import ButtonBase from 'Components/ButtonBase'
import useControlForm from 'hooks/useControlForm'
import loginSchema from './schemas/login-schema'
import { Link } from 'react-router-dom'
import userService from 'services/user/userService'
import { useState } from 'react'
import Loader from 'Components/Loader'
export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(null)
    const { control, getValues, formState: { isValid }, trigger } = useControlForm({
        schema: loginSchema,
        defaultValues: {
            email: '',
            password: ''
        }
    })
    const handleLogin = async () => {
        if (!isValid) {
            trigger()
            return
        }
        setLoading('Entrando...')
        const { email, password } = getValues()
        const pass = await login({ email, password })
        if (pass) {
            navigate('/home')
        }
        setLoading(null)

    }
    const handleForgotPassword = async () => {
        const { email } = getValues()
        if (!email) {
            NotificationService.error({ text: 'Preencha o campo de email' })
            return
        }
        try {
            setLoading('Enviando email')
            await userService.forgotPassword(email)
            NotificationService.success({ text: 'Email de recuperação enviado' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
        setLoading(null)
    }
    return (
        <div>
            <Loader loading={!!loading} text={loading} />
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
                <div className={styles.login}>
                    <div className={styles.title}>
                        <h1>Login</h1>
                        <span>Digite seu email e senha para continuar</span>
                    </div>
                    <div className={styles.inputs}>
                        <InputForm label="email" control={control} name="email" type="email" />
                        <InputForm label="senha" control={control} name="password" type="password" />
                        <a href='#' onClick={handleForgotPassword}>Esqueceu sua senha?</a>
                        <ButtonBase label={'login'} onClick={handleLogin} />
                    </div>
                    <Link to={'/registrar'}>
                        Ainda não tem uma conta? Cadastre-se
                    </Link>
                </div>
            </div>
        </div>
    )
}