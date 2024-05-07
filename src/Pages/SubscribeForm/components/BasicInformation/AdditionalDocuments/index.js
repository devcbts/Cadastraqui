import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import InputForm from "../../../../../Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from '../styles.module.scss'
import additionalDocumentSchema from "./schemas/additional-document-schema";
import FormSelect from "../../../../../Components/FormSelect";
import DOCUMENT_TYPE from "../../../../../utils/enums/document-type";

const AdditionalDocuments = forwardRef((_, ref) => {
    const { control, watch, setValue, trigger, formState: { isValid } } = useForm({
        mode: "all",
        defaultValues: {
            newDocument: false,
            documentType: "",
            documentNumber: "",
            documentValidity: ""
        },
        resolver: zodResolver(additionalDocumentSchema)
    })
    const watchNewDocument = watch("newDocument")
    const watchDocumentType = watch("documentType")
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        }
    }))

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Documento Adicional</h1>
            <div >
                <InputForm name={"newDocument"} control={control} label={"deseja adicionar outro documento?"} />
                {watchNewDocument &&
                    <>
                        <FormSelect name={"documentType"} control={control} label={"tipo de documento"} options={DOCUMENT_TYPE} value={DOCUMENT_TYPE.find(e => e.value === watchDocumentType)} />
                        <InputForm name={"documentNumber"} control={control} label={"número do documento"} />
                        <InputForm name={"documentValidity"} control={control} label={"data de validade do documento"} type="date" />
                    </>
                }
            </div>
        </div>
    )
})

export default AdditionalDocuments