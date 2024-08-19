import FilePreview from "Components/FilePreview";
import FormFilePicker from "Components/FormFilePicker";
import FormSelect from "Components/FormSelect";
import InputForm from "Components/InputForm";
import useControlForm from "hooks/useControlForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { forwardRef } from "react";
import STATES from "utils/enums/states";
import { formatRG } from "utils/format-rg";
import documentSchema from "./schemas/document-schema";
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category";

const Document = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: documentSchema,
        defaultValues: {
            RG: "",
            rgIssuingState: "",
            rgIssuingAuthority: "",
            file_idDocument: null,
            url_idDocument: null,
            metadata_idDocument: {
                type: METADATA_FILE_TYPE.DOCUMENT.ID,
                category: METADATA_FILE_CATEGORY.Identity
            }
        },
        initialData: data
    }, ref)

    const watchIssuingState = watch("rgIssuingState")
    const watchFile = watch("file_idDocument")

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Documento de Identificação</h1>
            {
                !!data?.fullName &&
                <h4 className={commonStyles.subTitle}>{data?.fullName}</h4>
            }
            <div className={commonStyles.container}>
                <InputForm name={"RG"} control={control} label={"RG/RNE"} transform={(e) => formatRG(e.target.value)} />
                <FormSelect name={"rgIssuingState"} control={control} label={"estado emissor do RG/RNE"} options={STATES} value={watchIssuingState} />
                <InputForm name={"rgIssuingAuthority"} control={control} label={"órgão emissor do RG/RNE"} />
                <FormFilePicker name={"file_idDocument"} control={control} label={"documento de identificação"} accept={'application/pdf'} />

                <FilePreview file={watchFile} url={data.url_idDocument} text={'visualizar documento'} />
            </div>
        </div>
    )
})

export default Document