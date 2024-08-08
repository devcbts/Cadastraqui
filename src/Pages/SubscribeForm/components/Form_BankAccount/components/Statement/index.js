import FilePreview from "Components/FilePreview";
import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";
import { forwardRef } from "react";
import statementSchema from "./schemas/statement-schema";

const Statement = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: statementSchema,
        defaultValues: {
            file_statement: null,
            url_statement: null
        },
        initialData: data
    }, ref)
    const watchFile = watch("file_statement")
    return (
        <>
            <FormFilePicker control={control} accept={"application/pdf"} label={'extrato'} name={"file_statement"} />
            <h6 style={{ color: '#b60321', }}>*Tamanho máximo de 10Mb</h6>
            <FilePreview file={watchFile} url={data?.url_statement} text={"ver extrato"} />
        </>
    )
})



export default Statement