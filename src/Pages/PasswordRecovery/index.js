import logo from "../../Assets/Prancheta 3@300x-8.png";
import videoBg from "../../Assets/bg-school-vid.mp4";
import { UilLock } from "@iconscout/react-unicons";
import LoginInput from "../Login/LoginInput";
import useForm from "../../hooks/useForm";
import LoginButton from "../Login/LoginButton";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import { api } from "../../services/axios";
import { useSearchParams } from "react-router-dom";
import passwordRecoveryValidation from "./validations/pass-recovery-validation";
export default function PasswordRecovery() {
    const [[password], handlePassword, errors] = useForm({
        password: '',
        passwordConfirmation: ''
    }, passwordRecoveryValidation)
    const [query] = useSearchParams()
    const token = query.get("token")
    const navigate = useNavigate()
    useEffect(() => {
        const handleToken = async () => {
            try {
                await api.get('/verify-password-token', { params: { token } })
            } catch (err) {
                Swal.fire({
                    title: 'Erro',
                    text: 'Token inválido ou expirado',
                    icon: "error"
                }).then(() =>
                    navigate('/login')
                )
            }
        }
        handleToken()
    }, [query])
    const handleResetPassword = async () => {

        try {
            await api.post(`/reset_password?token=${token}`, password)
            Swal.fire({
                title: "Alteração concluída",
                text: "Senha alterada com sucesso",
                icon: "success"
            }).then(() =>
                navigate('/login')
            )
        } catch (err) {
            Swal.fire({
                title: "Erro",
                text: "Erro ao alterar senha",
                icon: "error"
            })
        }
    }
    return (
        <div className="login-container">
            <div id="object-one">
                <video className="video-header" src={videoBg} autoPlay loop muted />
            </div>

            <div id="object-two"></div>

            <div className="login-box">
                <div className="login-logo">
                    <img src={logo}></img>
                </div>
                <div className="text-login">
                    <h1>Recuperação de Senha</h1>

                    <div
                        className={`cadastro-second `}
                    >
                        <h2>Digite sua nova senha</h2>
                        <form>


                            <LoginInput
                                Icon={UilLock}
                                name='password'
                                type="password"
                                placeholder="Nova senha"
                                value={password.password}
                                onChange={handlePassword}
                                error={errors}
                                showErrorHint
                            />


                            <LoginButton label='Salvar nova senha' onClick={handleResetPassword} />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}