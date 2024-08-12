import FilePreview from "Components/FilePreview";
import FormFilePicker from "Components/FormFilePicker";
import FormSelect from "Components/FormSelect";
import useControlForm from "hooks/useControlForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { forwardRef, useEffect, useState } from "react";
import MARITAL_STATUS from "utils/enums/marital-status";
import maritalStatusSchema from "./schemas/marital-status-schema";
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
const MaritalStatus = forwardRef(({ data }, ref) => {
    const { control, watch, setValue } = useControlForm({
        schema: maritalStatusSchema,
        defaultValues: {
            maritalStatus: '',
            file_statusCertificate: null,
            url_statusCertificate: null,
            metadata_statusCertificate: null
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
                setValue("metadata_statusCertificate", { type: METADATA_FILE_TYPE.MARITAL.MARRIED })
                break
            case 'Single':
                setText('Certidão de nascimento')
                setValue("metadata_statusCertificate", { type: METADATA_FILE_TYPE.MARITAL.SINGLE })
                break
            case "Separated" || "Divorced":
                setText('Certidão de casamento com averbação de divórcio')
                setValue("metadata_statusCertificate", { type: METADATA_FILE_TYPE.MARITAL.DIVORCED })
                break
            case "Widowed":
                setText('Certidão de casamento com anotação de viuvez')
                setValue("metadata_statusCertificate", { type: METADATA_FILE_TYPE.MARITAL.WIDOW })
                break
            case "StableUnion":
                setText('Declaração de união estável')
                setValue("metadata_statusCertificate", { type: METADATA_FILE_TYPE.MARITAL.STABLE })

                break

        }
    }, [watchStatus])

    let fullName = ''
    if (data?.fullName && data?.fullName !== '') {
        fullName = data?.fullName;
    } else if (data?.name) {
        fullName = data?.name;
    }

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Estado Civil</h1>
            <h4 className={commonStyles.subTitle}>{fullName}</h4>

            <>
                <FormSelect name="maritalStatus" label="estado civil" control={control} options={MARITAL_STATUS} value={watchStatus} />
                {!!watchStatus &&
                    <FormFilePicker name="file_statusCertificate" label={text} control={control} accept={'application/pdf'} />
                }
                {!!watchStatus &&
                    <h6 className={commonStyles.aviso}>*Tamanho máximo de 10Mb</h6>
                }
                <FilePreview file={watchFile} url={data.url_statusCertificate} text={'visualizar documento'} />

            </>
        </div>
    )
})

export default MaritalStatus