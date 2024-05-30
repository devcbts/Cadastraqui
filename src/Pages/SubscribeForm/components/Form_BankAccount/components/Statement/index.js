import useControlForm from "hooks/useControlForm";
import { forwardRef } from "react";
import statementSchema from "./schemas/statement-schema";
import FormFilePicker from "Components/FormFilePicker";
import FilePreview from "Components/FilePreview";

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
            <FilePreview file={watchFile} url={data?.url_statement} text={"ver extrato"} />
        </>
    )
})



export default Statement