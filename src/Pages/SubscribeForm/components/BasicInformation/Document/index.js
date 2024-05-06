import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import styles from './styles.module.scss'
import { formatRG } from "../../../../../utils/format-rg";
import documentSchema from "./schemas/document-schema";
import InputForm from "../../../../../Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from '../styles.module.scss'

const Document = forwardRef((_, ref) => {
    const { control, watch, setValue, trigger, formState: { isValid } } = useForm({
        mode: "all",
        defaultValues: {
            RG: "",
            rgIssuingState: "",
            rgIssuingAuthority: "",
            document: "",

        },
        resolver: zodResolver(documentSchema)
    })
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        }
    }))
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Documento de Identificação</h1>
            <div className={styles.container}>
                <InputForm name={"RG"} control={control} label={"RG"} transform={(e) => formatRG(e.target.value)} />
                <InputForm name={"rgIssuingState"} control={control} label={"estado emissor do RG"} />
                <InputForm name={"rgIssuingAuthority"} control={control} label={"órgão emissor do RG"} />
                <InputForm name={"document"} control={control} label={"documento de identificação"} type="file" />

            </div>
        </div>
    )
})

export default Document