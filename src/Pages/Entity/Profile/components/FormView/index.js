import ButtonBase from "Components/ButtonBase";
import FormSelect from "Components/FormSelect";
import InputForm from "Components/InputForm";
import useControlForm from "hooks/useControlForm";
import { useState } from "react";
import STATES from "utils/enums/states";
import { formatCEP } from "utils/format-cep";
import { formatCNPJ } from "utils/format-cnpj";
import entityProfileSchema from "./schemas/entity-profile-schema";
import { NotificationService } from "services/notification";
import entityService from "services/entity/entityService";
import useCep from "hooks/useCep";

export default function FormView({ data, onEdit }) {
    const [edit, setEdit] = useState(false)
    const { control, watch, reset, formState: { isValid }, trigger, getValues, setValue } = useControlForm({
        schema: entityProfileSchema,
        defaultValues: {
            email: "",
            name: "",
            socialReason: "",
            CNPJ: "",
            CEP: "",
            address: "",
            addressNumber: "",
            neighborhood: "",
            city: "",
            UF: "",
        },
        initialData: data
    })
    const handleCancel = () => {
        setEdit(false)
        reset()
    }
    const handleEdit = async () => {
        if (edit) {
            if (!isValid) {
                trigger()
                return
            }
            try {
                const values = getValues()
                await entityService.updateProfile(values)
                NotificationService.success({ text: 'Dados atualizados' })
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
                return
            }
        }
        setEdit((prev) => !prev)
    }
    useCep((address) => {
        setValue("UF", address?.UF)
        setValue("address", address?.address)
        setValue("city", address?.city)
        setValue("neighborhood", address?.neighborhood)
    }, watch("CEP"))
    return (
        <div>

            <fieldset disabled={!edit}>
                <InputForm control={control} name="socialReason" label={"razão social"} />
                <InputForm control={control} name="name" label={"nome fantasia (se houver)"} />
                <InputForm control={control} name="email" label={"email"} />
                <InputForm control={control} name="CNPJ" label={"CNPJ"} transform={(e) => formatCNPJ(e.target.value)} />
                <InputForm control={control} name="CEP" label={"CEP"} transform={(e) => formatCEP(e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px' }}>
                    <InputForm control={control} name="city" label={"cidade"} />
                    <FormSelect control={control} name="UF" label={"UF"} value={watch("UF")} options={STATES} />
                    <InputForm control={control} name="neighborhood" label={"bairro"} />
                    <InputForm control={control} name="addressNumber" label={"número"} transform={(e) => {
                        if (!isNaN(parseInt(e.target.value))) {
                            return parseInt(e.target.value, 10)
                        }
                        return null
                    }} />
                </div>
                <InputForm control={control} name="address" label={"rua"} />

            </fieldset>
            <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-around' }}>

                {edit && <ButtonBase label="cancelar" onClick={handleCancel} />}
                <ButtonBase label={edit ? 'salvar' : 'editar'} onClick={handleEdit} />
                {!edit && (
                    <ButtonBase label={'alterar senha'} onClick={onEdit} />
                )}
            </div>
        </div>
    )
}