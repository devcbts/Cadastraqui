
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { api } from "../../services/axios";
import { useSearchParams } from "react-router-dom";
import useControlForm from "hooks/useControlForm";
import passwordRecoverySchema from "./schemas/password-recovery-schema";
import Loader from "Components/Loader";
import Logo from 'Assets/images/logo_white.png'
import styles from './styles.module.scss'
import InputForm from "Components/InputForm";
import ButtonBase from "Components/ButtonBase";
import { NotificationService } from "services/notification";
export default function PasswordRecovery() {
    const [query] = useSearchParams()
    const token = query.get("token")
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const { control, formState: { isValid }, trigger, getValues } = useControlForm({
        schema: passwordRecoverySchema,
        defaultValues: {
            password: '',
            passwordConfirm: ''
        }
    })


    useEffect(() => {
        const handleToken = async () => {
            try {
                setIsLoading(true)
                await api.get('/verify-password-token', { params: { token } })
            } catch (err) {
                NotificationService.error({ text: 'Token inválido ou expirado' }).then(_ => navigate('/'))
            }
            setIsLoading(false)
        }
        handleToken()
    }, [query])
    const handleResetPassword = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const password = getValues("password")
            setIsLoading(true)
            await api.post(`/reset_password?token=${token}`, { password })
            NotificationService.success({ text: 'Senha alterada' }).then(_ => navigate('/'))
        } catch (err) {
            NotificationService.error({ text: 'Erro ao alterar senha' })

        }
        setIsLoading(false)
    }
    return (
        <div>
            <Loader loading={isLoading} />
            <header style={{ height: '80px', backgroundColor: '#1F4B73', display: 'flex', flexDirection: 'row', justifyContent: 'start', padding: '0 40px', alignItems: 'center' }}>
                <img className={styles.logo} src={Logo} alt='Logo' />
            </header>
            <div style={{ display: 'flex', placeContent: 'center' }}>

                <div className={styles.container}>
                    <h1 className={styles.title}>Alterar senha</h1>
                    <div className={styles.inputs}>
                        <InputForm control={control} name={"password"} label={"senha"} type="password" />
                        <InputForm control={control} name={"passwordConfirm"} label={"confirme sua senha"} type="password" />
                    </div>
                    <ButtonBase label={'alterar senha'} onClick={handleResetPassword} />
                </div>
            </div>
        </div>
    )
}