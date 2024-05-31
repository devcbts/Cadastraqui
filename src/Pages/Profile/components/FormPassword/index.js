import InputForm from "Components/InputForm";
import formPasswordSchema from "./schemas/form-password-schema";
import useControlForm from "hooks/useControlForm";
import commonStyles from '../../styles.module.scss'
import ButtonBase from "Components/ButtonBase";
import userService from "services/user/userService";
import { NotificationService } from "services/notification";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
export default function FormPassword({ onCancel }) {
    const { control, getValues, formState: { isValid }, trigger } = useForm({
        mode: 'all',
        defaultValues: {
            oldPassword: '',
            newPassword: ''
        },
        resolver: zodResolver(formPasswordSchema),
    })
    const handleUpdatePassword = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const { oldPassword, newPassword } = getValues()
            await userService.changePassword({ oldPass: oldPassword, newPass: newPassword })
            NotificationService.success({ text: 'Senha alterada com sucesso' })
        } catch (err) {
            NotificationService.error({ text: err.response?.data?.message })
        }
    }
    return (
        <>
            <div>
                <InputForm control={control} type="password" name="oldPassword" label={'senha atual'} />
                <InputForm control={control} type="password" name="newPassword" label={'nova senha'} />
            </div>
            <div className={commonStyles.actions}>
                <ButtonBase label={'cancelar'} onClick={onCancel} />
                <ButtonBase label={'salvar'} onClick={handleUpdatePassword} />
            </div>
        </>
    )
}