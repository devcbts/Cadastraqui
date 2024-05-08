import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import styles from './styles.module.scss'
import { formatRG } from "utils/format-rg";
import documentSchema from "./schemas/document-schema";
import InputForm from "Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import FormFilePicker from "Components/FormFilePicker";
import FormSelect from "Components/FormSelect";
import STATES from "utils/enums/states";

const Document = forwardRef(({ data }, ref) => {
    const { control, watch, setValue, trigger, formState: { isValid }, getValues } = useForm({
        mode: "all",
        defaultValues: {
            RG: "",
            rgIssuingState: "",
            rgIssuingAuthority: "",
            document: "",
        },
        values: data && {
            RG: data.RG,
            rgIssuingState: data.rgIssuingState,
            rgIssuingAuthority: data.rgIssuingAuthority,
            document: data.document,
        },
        resolver: zodResolver(documentSchema)
    })
    const watchIssuingState = watch("rgIssuingState")
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues
    }))
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Documento de Identificação</h1>
            <div className={styles.container}>
                <InputForm name={"RG"} control={control} label={"RG"} transform={(e) => formatRG(e.target.value)} />
                <FormSelect name={"rgIssuingState"} control={control} label={"estado emissor do RG"} options={STATES} value={STATES.find(e => e.value === watchIssuingState)} />
                <InputForm name={"rgIssuingAuthority"} control={control} label={"órgão emissor do RG"} />
                <FormFilePicker name={"document"} control={control} label={"documento de identificação"} />

            </div>
        </div>
    )
})

export default Document