import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import commonStyles from '../styles.module.scss'
import InputForm from "../../../../../Components/InputForm";
import personalInformationSchema from "./schemas/personal-information-schema";
import FormSelect from "../../../../../Components/FormSelect";
import SCHOLARSHIP from "../../../../../utils/enums/scholarship";
import SKINCOLOR from "../../../../../utils/enums/skin-color";
import styles from './styles.module.scss'
const PersonalInformation = forwardRef(({ data }, ref) => {
    const { control, formState: { isValid }, trigger, watch, getValues } = useForm({
        mode: "all",
        defaultValues: {
            skinColor: '',
            educationLevel: '',
            specialNeeds: false
        },
        values: data && {
            skinColor: data.skinColor,
            educationLevel: data.educationLevel,
            specialNeeds: data.specialNeeds
        },
        resolver: zodResolver(personalInformationSchema)
    })
    const watchSkinColor = watch("skinColor")
    const watchScholarship = watch("educationLevel")
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues
    }))
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Estado Civil</h1>
            <div className={styles.grid}>
                <FormSelect name="skinColor" label="cor de pele" control={control} options={SKINCOLOR} value={SKINCOLOR.find(e => e.value === watchSkinColor)} />
                <FormSelect name="educationLevel" label="escolaridade" control={control} options={SCHOLARSHIP} value={SKINCOLOR.find(e => e.value === watchScholarship)} />
            </div>
            <InputForm name="specialNeeds" label="necessidades especiais" control={control} />
        </div>
    )
})

export default PersonalInformation