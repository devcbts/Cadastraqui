import InputForm from "Components/InputForm"
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { formatCPF } from "utils/format-cpf"
import { formatTelephone } from "utils/format-telephone"
import { forwardRef } from "react"
import useControlForm from "hooks/useControlForm"
import FormSelect from "Components/FormSelect"
import BANK_ACCOUNT_TYPES from "utils/enums/bank-account-types"
import bankAccountSchema from "./schemas/bank-account-schema"
const BankAccount = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: bankAccountSchema,
        defaultValues: {
            bankName: '',
            accountType: '',
            agencyNumber: '',
            accountNumber: '',
        },
        initialData: data
    }, ref)
    const watchType = watch("accountType")
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Dados Bancários</h1>
            <InputForm name="bankName" label="banco" control={control} />
            <FormSelect name="accountType" label="tipo de conta" control={control} options={BANK_ACCOUNT_TYPES} value={watchType} />
            <InputForm name="agencyNumber" label="agência" control={control} />
            <InputForm name="accountNumber" label="número da conta" control={control} />
        </div>
    )
})

export default BankAccount