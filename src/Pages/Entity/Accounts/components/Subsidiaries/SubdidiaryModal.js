import FormSelect from "Components/FormSelect";
import InputForm from "Components/InputForm";
import Modal from "Components/Modal";
import useCep from "hooks/useCep";
import useControlForm from "hooks/useControlForm";
import entityService from "services/entity/entityService";
import { NotificationService } from "services/notification";
import STATES from "utils/enums/states";
import { formatCEP } from "utils/format-cep";
import subsidiaryModalSchema from "./schemas/subsidiary-modal-schema";

export default function SubsidiaryModal({ data, onClose }) {
    const { control, formState: { isValid }, trigger, getValues, watch, setValue } = useControlForm({
        schema: subsidiaryModalSchema,
        defaultValues: {
            CEP: "",
            address: "",
            addressNumber: "",
            city: "",
            UF: "",
            socialReason: "",
            educationalInstitutionCode: ""
        },
        initialData: data
    })
    const handleSubmit = async () => {
        if (!isValid) {
            trigger()
            return
        }
        try {
            const values = getValues()
            await entityService.updateSubsidiary(data.id, values)
            NotificationService.success({ text: 'Dados alterados' })
            onClose(values)
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })

        }
    }
    useCep((address) => {
        setValue("UF", address?.UF)
        setValue("address", address?.address)
        setValue("city", address?.city)
        setValue("neighborhood", address?.neighborhood)
    }, watch("CEP"))
    return (
        <Modal open={!!data}
            title={'Editar filial'}
            onCancel={onClose} onConfirm={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>

                <InputForm control={control} name="CEP" label="CEP" transform={(e) => formatCEP(e.target.value)} />
                <InputForm control={control} name="address" label="rua" />
                <InputForm control={control} name="addressNumber" label="Número" transform={(e) => {
                    if (!isNaN(parseInt(e.target.value))) {
                        return parseInt(e.target.value, 10)
                    }
                    return null
                }} />
                <InputForm control={control} name="city" label="Cidade" />
                <FormSelect control={control} name="UF" label="UF" options={STATES} value={watch("UF")} />
                <InputForm control={control} name="socialReason" label="Razão Social" />
                <InputForm control={control} name="educationalInstitutionCode" label="código e-MEC/educacenso" />
            </div>
        </Modal>
    )
}