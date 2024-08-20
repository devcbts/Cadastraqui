import { ReactComponent as IconLogo } from 'Assets/icons/logo.svg'
import Logo from 'Assets/images/logo_white.png'
import ButtonBase from 'Components/ButtonBase'
import InputForm from 'Components/InputForm'
import Loader from 'Components/Loader'
import useAuth from 'hooks/useAuth'
import useControlForm from 'hooks/useControlForm'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { NotificationService } from 'services/notification'
import userService from 'services/user/userService'
import loginSchema from './schemas/login-schema'
import styles from './styles.module.scss'
import { api } from 'services/axios'
import UnauthenticatedHeader from 'Components/Header/variants/UnauthenticatedHeader'
export default function Login() {
    const { login } = useAuth()
    const { state } = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(null)
    const { control, getValues, formState: { isValid }, trigger, getFieldState } = useControlForm({
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
            if (state?.announcementId) {

                navigate(`/edital/${state.announcementId}`, { state: {} })
                return
            }
            navigate('/home')
        }
        setLoading(null)

    }
    const handleForgotPassword = async () => {

        const { email } = getValues()
        const isEmailInvalid = getFieldState("email").invalid
        if (!email || isEmailInvalid) {
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
            <UnauthenticatedHeader />
            <div className={styles.content}>
                <div className={styles.brand}>
                    <IconLogo />
                    <h2>
                        Plataforma para processos de concessão e manutenção de bolsas de estudos para fins de CEBAS
                    </h2>
                </div>
                <div className={styles.login}>
                    <div className={styles.title}>
                        <h1>Login</h1>
                        <span>Digite seu email e senha para continuar</span>
                    </div>
                    <div className={styles.inputs}>
                        <InputForm label="email" control={control} name="email" type="email" />
                        <InputForm label="senha" control={control} name="password" type="password" />
                        <p tabIndex={0} role='link' onClick={handleForgotPassword}
                            onKeyDown={(e) => {
                                if (e.code === "Enter") {
                                    handleForgotPassword()
                                }
                            }}
                        >Esqueceu sua senha?</p>
                        <ButtonBase label={'login'} onClick={handleLogin} />
                    </div>
                    <Link to={'/registrar'} state={state}>
                        Ainda não tem uma conta? Cadastre-se
                    </Link>
                </div>
            </div>
        </div>
    )
}