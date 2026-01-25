import personalDataFormSchema from "./schemas/personal-data-schema"
import InputForm from "Components/InputForm"
import FormCheckbox from "Components/FormCheckbox"
import FormSelect from "Components/FormSelect"
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { formatCPF } from "utils/format-cpf"
import { formatTelephone } from "utils/format-telephone"
import { forwardRef } from "react"
import useControlForm from "hooks/useControlForm"
import RELIGION from "utils/enums/religion"
import SCHOLARSHIP from "utils/enums/scholarship"
import SKINCOLOR from "utils/enums/skin-color"
import styles from './styles.module.scss'

const PersonalData = forwardRef(({ data, tooltips }, ref) => {
    const { control, watch } = useControlForm({
        schema: personalDataFormSchema,
        defaultValues: {
            fullName: '',
            CPF: '',
            birthDate: '',
            landlinePhone: '',
            email: '',
            skinColor: '',
            educationLevel: '',
            specialNeeds: null,
            specialNeedsDescription: '',
            specialNeedsType: '',
            religion: ''
        },
        initialData: data
    }, ref)

    const watchSkinColor = watch("skinColor")
    const watchScholarship = watch("educationLevel")
    const watchReligion = watch("religion")
    const watchNeeds = watch("specialNeeds")

    let fullName = ''
    if (data?.fullName && data?.fullName !== '') {
        fullName = data?.fullName;
    } else if (data?.name) {
        fullName = data?.name;
    }

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Dados Pessoais</h1>
            <h4 className={commonStyles.subTitle}>{fullName}</h4>
            <div className={styles.container}>
                <InputForm name="fullName" label="nome completo" control={control} />
                <InputForm name="CPF" label="CPF" control={control} transform={(e) => formatCPF(e.target.value)} />
                <InputForm name="birthDate" label="data de nascimento" type="date" control={control} />
                <InputForm name="landlinePhone" label="telefone" control={control} transform={(e) => formatTelephone(e.target.value)} tooltip={tooltips?.['landlinePhone']} />
                <InputForm name="email" label="email" control={control} tooltip={tooltips?.['email']} />
                <FormSelect name="skinColor" label="cor de pele" control={control} options={SKINCOLOR} value={watchSkinColor} />
                <FormSelect name="educationLevel" label="escolaridade" control={control} options={SCHOLARSHIP} value={watchScholarship} />
                <FormSelect name="religion" label="religião" control={control} options={RELIGION} value={watchReligion} />
            </div>
            <FormCheckbox name="specialNeeds" label="necessidades especiais" control={control} />
            {
                watchNeeds && (
                    <>
                        <InputForm control={control} name={"specialNeedsType"} label={"Tipo de necessidades especiais"} />
                        <InputForm control={control} name={"specialNeedsDescription"} label={"descrição das necessidades especiais"} />
                    </>
                )
            }
        </div>
    )
})

export default PersonalData