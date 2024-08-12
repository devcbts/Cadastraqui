import ButtonBase from "Components/ButtonBase"
import FormSelect from "Components/FormSelect"
import InputForm from "Components/InputForm"
import useCep from "hooks/useCep"
import useCnpj from "hooks/useCnpj"
import useControlForm from "hooks/useControlForm"
import entityService from "services/entity/entityService"
import { NotificationService } from "services/notification"
import STATES from "utils/enums/states"
import { formatCEP } from "utils/format-cep"
import { formatCNPJ } from "utils/format-cnpj"
import subsidiarySchema from "./schemas/subsidiary-schema"

export default function Subsidiary() {
    const { control, formState: { isValid }, watch, getValues, setValue, reset, trigger } = useControlForm({
        schema: subsidiarySchema,
        defaultValues: {
            name: "",
            email: "",
            CEP: "",
            CNPJ: "",
            educationalInstitutionCode: "",
            socialReason: "",
            name: "",
            address: "",
            addressNumber: "",
            city: "",
            UF: "",
            neighborhood: "",
        }
    })
    const watchStates = watch("UF")
    const watchCep = watch("CEP")
    const watchCnpj = watch("CNPJ")
    const handleRegister = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const data = getValues()
            await entityService.registerSubsidiary(data)
            reset()
            NotificationService.success({ text: 'Filial criada' })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })

        }
    }
    useCep((address) => {
        setValue("UF", address?.UF)
        setValue("address", address?.address)
        setValue("city", address?.city)
        setValue("neighborhood", address?.neighborhood)
    }, watchCep)

    useCnpj((cnpj) => {
        setValue("socialReason", cnpj?.name)
        setValue("CEP", cnpj?.CEP)
        setValue("email", cnpj?.emails?.[0])
        setValue("phone", cnpj?.phones?.[0])

    }, watchCnpj)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            <h1>Informações Cadastrais</h1>
            <div style={{ width: 'max(290px, 50%)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px', }}>
                    <InputForm control={control} name={"CNPJ"} label={"CNPJ"} transform={(e) => formatCNPJ(e.target.value)} />
                    <InputForm control={control} name={"socialReason"} label={"razão social"} />
                    <InputForm control={control} name={"name"} label={"nome fantasia (se houver)"} />
                    <InputForm control={control} name={"CEP"} label={"CEP"} transform={(e) => formatCEP(e.target.value)} />
                    <InputForm control={control} name={"address"} label={"rua"} />
                    <InputForm control={control} name={"neighborhood"} label={"bairro"} />
                    <InputForm control={control} name={"city"} label={"cidade"} />
                    <FormSelect control={control} name={"UF"} label={"UF"} options={STATES} value={watchStates} />
                    <InputForm control={control} name={"addressNumber"} label={"número"} />
                </div>
                <InputForm control={control} name={"educationalInstitutionCode"} label={"código no educacenso/e-MEC"} />
                <InputForm control={control} name={"email"} label={"email institucional"} />
            </div>
            <ButtonBase label={'cadastrar'} onClick={handleRegister} />
        </div>
    )
}