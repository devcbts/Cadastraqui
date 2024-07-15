import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import InputForm from "Components/InputForm";
import personalInformationSchema from "./schemas/personal-information-schema";
import FormSelect from "Components/FormSelect";
import SCHOLARSHIP from "utils/enums/scholarship";
import SKINCOLOR from "utils/enums/skin-color";
import styles from './styles.module.scss'
import FormCheckbox from "Components/FormCheckbox";
import RELIGION from "utils/enums/religion";
import useControlForm from "hooks/useControlForm";
const PersonalInformation = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: personalInformationSchema,
        defaultValues: {
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

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Informações Pessoais</h1>
            <div className={styles.grid}>
                <FormSelect name="skinColor" label="cor de pele" control={control} options={SKINCOLOR} value={watchSkinColor} />
                <FormSelect name="educationLevel" label="escolaridade" control={control} options={SCHOLARSHIP} value={watchScholarship} />
                <FormSelect name="religion" label="religião" control={control} options={RELIGION} value={watchReligion} />
            </div>
            <FormCheckbox name="specialNeeds" label="necessidades especiais" control={control} />
            {
                watchNeeds && (
                    <>
                        <InputForm control={control} name={"specialNeedsType"} label={"tipo das necessidades especiais"} />
                        <InputForm control={control} name={"specialNeedsDescription"} label={"descrição das necessidades especiais"} />
                    </>
                )
            }
        </div>
    )
})

export default PersonalInformation