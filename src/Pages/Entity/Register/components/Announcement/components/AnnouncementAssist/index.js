import BackPageTitle from "Components/BackPageTitle"
import ButtonBase from "Components/ButtonBase"
import FormCheckbox from "Components/FormCheckbox"
import FormSelect from "Components/FormSelect"
import InputForm from "Components/InputForm"
import useControlForm from "hooks/useControlForm"
import TYPE_ONE_BENEFITS from "utils/enums/type-one-benefits"
import Term from "./Term"
import announcementBenefitsSchema from "./schemas/announcement-benefits-schema"

export default function AnnouncementAssist({ data, onPageChange }) {
    const { control, watch, formState: { isValid }, getValues, trigger } = useControlForm({
        schema: announcementBenefitsSchema,
        defaultValues: {
            hasBenefits: null,
            hasServices: null,
            type1: [],
            type2: ""
        },
        initialData: data
    })
    const handleSubmit = () => {
        if (!isValid) {
            trigger()
            return
        }
        const values = getValues()
        onPageChange(1, values)
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <BackPageTitle title={'Ações de Apoio'} onClick={() => onPageChange(-1)} />
            <div style={{ width: 'max(400px, 50%)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <FormCheckbox control={control} name={"hasBenefits"} label={'a entidade concederá benefícios aos alunos?'} />
                {
                    watch("hasBenefits") && (
                        <FormSelect multiple control={control} name={"type1"} label="Seleção de benefícios" options={TYPE_ONE_BENEFITS} value={watch("type1")} />
                    )
                }
                <Term text={`
                O Termo de Concessão de Benefícios - Tipo 1: Ações de apoio ao aluno bolsista, será disponibilizado no perfil do 
                candidato para que o mesmo ou seu responsável legal, quando for o caso, assine e providencie a entrega na entidade.
                `} />
                <FormCheckbox control={control} name={"hasServices"} label={'haverá ações e serviços destinados a alunos e seu grupo familiar?'} />
                {
                    watch("hasServices") && (
                        <InputForm multiple control={control} name={"type2"} label="descreva o(s) serviço(s) que será(ão) usufruído(s)" />
                    )
                }
                <Term text={`
                O Termo de Concessão de Benefícios - Tipo 2: Ações e serviços destinados a alunos e seu grupo familiar, 
                será disponibilizado no perfil do candidato para que o mesmo ou seu responsável legal quando for o caso, assine e providencie a entrega na entidade.
                `} />
            </div>
            <ButtonBase label={'próximo'} onClick={handleSubmit} />
        </div>
    )
}