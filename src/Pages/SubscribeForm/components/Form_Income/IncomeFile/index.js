import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";
import commonStyles from '../../../styles.module.scss'
import { z } from "zod";
import FilePreview from "Components/FilePreview";

const { forwardRef, useEffect } = require("react");

const IncomeFile = forwardRef(({ data }, ref) => {
    const { control, watch, setValue } = useControlForm({
        schema: z.object({
            file_document: z.instanceof(File).nullish()
        }),
        defaultValues: {
            file_document: null,
            url_document: ''
        },
        initialData: data
    }, ref)
    // useEffect(()=>{
    //     if(watch("file_document")){
    //         setValue()
    //     }
    // },[watch("file_document")])
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Comprovante</h1>
            <FormFilePicker control={control} name={"file_document"} label={'arquivo que comprove a situação'} accept={"application/pdf"} />
            <FilePreview url={watch("url_document")} file={watch("file_document")} text={'ver documento'} />
        </div>

    )
})
export default IncomeFile