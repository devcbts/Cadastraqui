import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import FormFilePicker from "Components/FormFilePicker";
import InputForm from "Components/InputForm";
import useControlForm from "hooks/useControlForm";
import { useNavigate } from "react-router";
import callService from "services/call/callService";
import { NotificationService } from "services/notification";
import { z } from "zod";

export default function CandidateCreateSAC() {
    const navigate = useNavigate()
    const { control, getValues, formState: { isValid }, trigger } = useControlForm({
        defaultValues: {
            name: '',
            subject: '',
            image: null,
            message: ''
        },
        schema: z.object({
            name: z.string().min(1, 'Nome obrigatório'),
            subject: z.string().min(1, 'Assunto obrigatório'),
            image: z.any(),
            message: z.string().min(1, 'Mensagem obrigatória')
        })
    })
    const handleCreateSAC = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const { name, subject, image, message } = getValues()
            await callService.createCall({
                name, subject, message, file: image
            })
            NotificationService.success({ text: 'Chamado criado' }).then(_ => {
                navigate('/sac')
            })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <>
            <BackPageTitle title={'Novo chamado'} path={'/sac'} />
            <div style={{ padding: '32px' }}>
                <InputForm control={control} name="name" label={'Nome'} />
                <InputForm control={control} name="subject" label={'assunto do chamado'} />
                <FormFilePicker control={control} name="image" label={'imagem (opcional)'} accept={'image/*'} />
                <InputForm type="text-area" label={'mensagem'} control={control} name="message" />
                <ButtonBase label={'criar chamado'} onClick={handleCreateSAC} />
            </div>
        </>
    )
}