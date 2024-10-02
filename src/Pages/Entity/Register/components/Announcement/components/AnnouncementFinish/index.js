import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import FilePreview from "Components/FilePreview";
import FormFilePicker from "Components/FormFilePicker";
import FormSelect from "Components/FormSelect";
import InputForm from "Components/InputForm";
import useControlForm from "hooks/useControlForm";
import CRITERIAS from "utils/enums/criterias";
import announcementFinishSchema from "./schemas/announcement-finish-schema";
import findLabel from "utils/enums/helpers/findLabel";

export default function AnnouncementFinish({ data, onPageChange, onSubmit, returnPage = true }) {
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
        <>
            {returnPage && <BackPageTitle title={'Finalizar Cadastro'} onClick={() => onPageChange(-1)} />}
            {!returnPage && <h1>Finalizar cadastro</h1>}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', }}>
                <div>
                    <FormSelect
                        multiple
                        label={'Selecione a ordem de prioridade para avaliação dos candidatos'}
                        name={"criteria"}
                        control={control}
                        options={CRITERIAS}
                        value={watch("criteria")} />
                    {
                        watch("criteria").length !== 0 && (
                            <ul>
                                {watch("criteria").map((e, i) => (
                                    <li>{`${i + 1}º - ${findLabel(CRITERIAS, e)}`}</li>
                                ))}
                            </ul>
                        )
                    }
                    <FormFilePicker control={control} name={"file"} accept={'application/pdf'} label={'PDF do Edital, Termo aditivo ou Comunicados'} />
                    <FilePreview file={watch("file")} text={'ver documento anexado'} />
                    <InputForm
                        control={control}
                        label={'descrição (opcional)'}
                        name="description"
                    />
                </div>
                <ButtonBase label={'cadastrar'} onClick={handleSubmit} />
            </div>
        </>
    )
}