import { zodResolver } from "@hookform/resolvers/zod";
import ButtonBase from "Components/ButtonBase";
import InputForm from "Components/InputForm";
import { useForm } from "react-hook-form";
import { NotificationService } from "services/notification";
import userService from "services/user/userService";
import commonStyles from '../../styles.module.scss';
import formPasswordSchema from "./schemas/form-password-schema";
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