import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import InputForm from "Components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import { useForm } from "react-hook-form";
import maritalStatusSchema from "./schemas/marital-status-schema";
import MARITAL_STATUS from "utils/enums/marital-status";
import FormSelect from "Components/FormSelect";
import FormFilePicker from "Components/FormFilePicker";
import useControlForm from "hooks/useControlForm";
import FilePreview from "Components/FilePreview";
import findLabel from "utils/enums/helpers/findLabel";
const MaritalStatus = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: maritalStatusSchema,
        defaultValues: {
            maritalStatus: '',
            file_statusCertificate: null,
            url_statusCertificate: null,
        },
        initialData: data
    }, ref)
    const watchStatus = watch("maritalStatus")
    const watchFile = watch("file_statusCertificate")
    const [text, setText] = useState('')
    useEffect(() => {

        switch (watchStatus) {
            case 'Married':
                setText('Certidão de casamento')
                break
            case 'Single':
                setText('Certidão de nascimento')
                break
            case "Separated" || "Divorced":
                setText('Certidão de casamento com averbação de divórcio')
                break
            case "Widowed":
                setText('Certidão de casamento com anotação de viuvez')
                break
            case "StableUnion":
                setText('Declaração de união estável')
                break

        }
    }, [watchStatus])

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Estado Civil</h1>
            <>
                <FormSelect name="maritalStatus" label="estado civil" control={control} options={MARITAL_STATUS} value={watchStatus} />
                {!!watchStatus &&
                    <FormFilePicker name="file_statusCertificate" label={text} control={control} accept={'application/pdf'} />}
                <FilePreview file={watchFile} url={data.url_statusCertificate} text={'visualizar documento'} />


            </>
        </div>
    )
})

export default MaritalStatus