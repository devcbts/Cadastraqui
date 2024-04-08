import Swal from "sweetalert2";
import UserService from "../../services/user/userService";
import Modal from "../Modal";
import { useState } from "react";
import useForm from "../../hooks/useForm";
import LoginInput from "../../Pages/Login/LoginInput";
import { UilLock } from "@iconscout/react-unicons";
import changePasswordValidation from "./validations/change-password-validation";
export default function ChangePassword() {
    const [openModal, setOpenModal] = useState(false)
    const [[password], handlePassChange, passErrors, submit, reset] = useForm({
        oldPass: '',
        newPass: ''
    }, changePasswordValidation)
    const handleConfirm = async () => {
        if (!submit()) {
            return
        }
        try {

            await UserService.changePassword(password)
            Swal.fire({
                title: "Senha alterada",
                icon: "success",
                text: "Senha alterada com sucesso"
            })
            handleCloseModal()
            reset()
        } catch (err) {
            Swal.fire({
                title: "Erro",
                icon: "error",
                text: err.response.data.message
            })
        }
    }
    const handleCloseModal = () => {
        setOpenModal(false)
    }
    const handleOpenModal = () => {
        setOpenModal(true)
    }
    return (
        <>
            <a href="#" className="btn-alterar" onClick={handleOpenModal}>
                <UilLock size="20" color="white"></UilLock>
                Alterar senha
            </a>
            <Modal
                title="Alterar senha"
                open={openModal}
                onConfirm={handleConfirm}
                onCancel={handleCloseModal}
            >
                <LoginInput
                    name="oldPass"
                    Icon={UilLock}
                    error={passErrors}
                    type="password"
                    onChange={handlePassChange}
                    placeholder="Senha atual"
                    showErrorHint
                ></LoginInput>
                <LoginInput
                    name="newPass"
                    Icon={UilLock}
                    error={passErrors}
                    type="password"
                    onChange={handlePassChange}
                    placeholder="Nova senha"
                    showErrorHint
                ></LoginInput>
            </Modal>
        </>
    )
}