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
import useControlForm from "hooks/useControlForm";

const Document = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: documentSchema,
        defaultValues: {
            RG: "",
            rgIssuingState: "",
            rgIssuingAuthority: "",
            document: "",
        },
        initialData: data
    }, ref)

    const watchIssuingState = watch("rgIssuingState")

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Documento de Identificação</h1>
            <div className={styles.container}>
                <InputForm name={"RG"} control={control} label={"RG"} transform={(e) => formatRG(e.target.value)} />
                <FormSelect name={"rgIssuingState"} control={control} label={"estado emissor do RG"} options={STATES} value={watchIssuingState} />
                <InputForm name={"rgIssuingAuthority"} control={control} label={"órgão emissor do RG"} />
                <FormFilePicker name={"document"} control={control} label={"documento de identificação"} />

            </div>
        </div>
    )
})

export default Document