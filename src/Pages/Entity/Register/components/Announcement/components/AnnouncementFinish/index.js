import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import FormSelect from "Components/FormSelect";
import useControlForm from "hooks/useControlForm";
import CRITERIAS from "utils/enums/criterias";
import announcementFinishSchema from "./schemas/announcement-finish-schema";
import FormFilePicker from "Components/FormFilePicker";
import FilePreview from "Components/FilePreview";
import InputForm from "Components/InputForm";

export default function AnnouncementFinish({ data, onPageChange, onSubmit }) {
    const { control, watch, formState: { isValid }, trigger, getValues } = useControlForm({
        schema: announcementFinishSchema,
        defaultValues: {
            criteria: [],
            file: null,
            description: ''
        },
        initialData: data
    })
    const handleSubmit = () => {
        if (!isValid) {
            trigger()
            return
        }
        const values = getValues()
        onSubmit({ ...data, ...values })
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <BackPageTitle title={'Finalizar Cadastro'} onClick={() => onPageChange(-1)} />
            <div>
                <FormSelect
                    multiple
                    label={'Selecione a ordem de prioridade para avaliação dos candidatos'}
                    name={"criteria"}
                    control={control}
                    options={CRITERIAS}
                    value={watch("criteria")} />
                <FormFilePicker control={control} name={"file"} accept={'application/pdf'} label={'Fazer upload do PDF do Edital, Termo aditivo ou Comunicados'} />
                <FilePreview file={watch("file")} text={'ver documento anexado'} />
                <InputForm
                    control={control}
                    label={'descrição'}
                    name="description"
                />
            </div>
            <ButtonBase label={'cadastrar'} onClick={handleSubmit} />
        </div>
    )
}