import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import additionalDocumentSchema from "./schemas/additional-document-schema";
import FormSelect from "Components/FormSelect";
import DOCUMENT_TYPE from "utils/enums/document-type";
import InputForm from "Components/InputForm";
import FormCheckbox from "Components/FormCheckbox";
import useControlForm from "hooks/useControlForm";

const AdditionalDocuments = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: additionalDocumentSchema,
        defaultValues: {
            newDocument: !!data?.documentType,
            documentType: null,
            documentNumber: "",
            documentValidity: ""
        },
        initialData: data
    }, ref)

    const watchNewDocument = watch("newDocument")
    const watchDocumentType = watch("documentType")
    useEffect(() => {
        if (!watchNewDocument) {
            resetField('documentType', { defaultValue: null })
            resetField('documentNumber')
            resetField('documentValidity')
        }
    }, [watchNewDocument])

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Documento Adicional</h1>
            <div >
                <FormCheckbox name={"newDocument"} control={control} label={"deseja adicionar outro documento?"} />
                {watchNewDocument &&
                    <>
                        <FormSelect name={"documentType"} control={control} label={"tipo de documento"} options={DOCUMENT_TYPE} value={watchDocumentType} />
                        <InputForm name={"documentNumber"} control={control} label={"número do documento"} />
                        <InputForm name={"documentValidity"} control={control} label={"data de validade do documento"} type="date" />
                    </>
                }
            </div>
        </div>
    )
})

export default AdditionalDocuments