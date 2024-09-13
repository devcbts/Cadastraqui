import FilePreview from "Components/FilePreview";
import FormFilePicker from "Components/FormFilePicker";
import FormSelect from "Components/FormSelect";
import InputForm from "Components/InputForm";
import RowTextAction from "Components/RowTextAction";
import useControlForm from "hooks/useControlForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import CONTRACT_TYPE from "utils/enums/contract-type";
import PROPERTY_STATUS from "utils/enums/property-status";
import GivenPropertyPDF from "../GivenPropertyPDF";
import PropertyOwner from "../PropertyOwner";
import propertyStatusSchema from "./schemas/property-status-schema";
import METADATA_FILE_TYPE from "utils/file/metadata-file-type";
import METADATA_FILE_CATEGORY from "utils/file/metadata-file-category";
import VerbalContractPDF from "../VerbalContractPDF";
import { NotificationService } from "services/notification";

const { forwardRef, useEffect, useState } = require("react");

const PropertyStatus = forwardRef(({ data }, ref) => {
    const { control, watch, resetField, setValue } = useControlForm({
        schema: propertyStatusSchema,
        defaultValues: {
            propertyStatus: '',
            grantorName: null,
            contractType: null,
            file_document: null,
            url_document: null,
            metadata_document: null,
            sign_housing: {
                email: '',
                file: null
            }
        },
        initialData: data
    }, ref)

    const watchPropertyStatus = watch("propertyStatus")
    const watchContractType = watch("contractType")
    const hasGrantorName = ["ProvidedByEmployer", "ProvidedByFamily", "ProvidedOtherWay"].includes(watchPropertyStatus)
    const declarationNeeded = ["ProvidedByFamily", "ProvidedOtherWay", ""].includes(watchPropertyStatus)
    const hasContractType = watchPropertyStatus === "Rented"
    useEffect(() => {
        if (hasGrantorName) {


            setValue("metadata_document", {
                type: METADATA_FILE_TYPE.RESIDENCE.GIVENPROPERTY,
                category: METADATA_FILE_CATEGORY.Residence
            })
            resetField("contractType", { defaultValue: null })
        }
        if (hasContractType) {


            setValue("metadata_document", {
                type: METADATA_FILE_TYPE.RESIDENCE.RENTCONTRACT,
                category: METADATA_FILE_CATEGORY.Residence
            })
            resetField("grantorName", { defaultValue: null })
        }
        if (!hasContractType && !hasGrantorName) {
            setValue("sign_housing", {
                defaultValue: {
                    email: '', file: null
                }
            })
        }
    }, [hasContractType, hasGrantorName, resetField, watchPropertyStatus])
    const watchFile = watch("file_document")
    const [ownerForm, setOwnerForm] = useState(false)
    const handlePropertyOwnerForm = (type = '') => {
        setOwnerForm((prev) => {
            if (prev) {
                return ''
            }
            return type
        })
    }
    const handleConfirmEmailSend = (email, file) => {
        NotificationService.confirm({
            title: 'Enviar por email?',
            text: `Um e-mail será enviado para ${email} para assinatura do documento`,
            onConfirm: () => {
                console.log(email, file, URL.createObjectURL(file))
                setValue("sign_housing", { email, file })
                setValue("url_document", URL.createObjectURL(file))
            }
        })
    }
    return (
        <div className={commonStyles.formcontainer}>
            <PropertyOwner show={ownerForm}
                onSendToEmail={!ownerForm ? null : handleConfirmEmailSend}
                onClose={handlePropertyOwnerForm} pdf={(data) => {
                    if (!ownerForm) return <></>
                    if (ownerForm === 'given') {
                        return <GivenPropertyPDF owner={data} />
                    }
                    if (ownerForm === 'verbal') {
                        return <VerbalContractPDF owner={data} />
                    }
                }} />
            <h1 className={commonStyles.title}>Status da Propriedade</h1>
            <FormSelect name="propertyStatus" label="status" control={control} options={PROPERTY_STATUS} value={watchPropertyStatus} />
            {
                hasGrantorName &&
                <>
                    <InputForm control={control} name="grantorName" label="nome do cedente" />
                    {declarationNeeded && (
                        <RowTextAction text={'Gerar declaração de imóvel cedido'} label={'gerar'} onClick={() => handlePropertyOwnerForm('given')} />
                    )}
                    <FormFilePicker name={'file_document'} control={control} accept={'application/pdf'} label={'documento'} />

                    <FilePreview file={watchFile} url={watch("url_document")} text={'visualizar documento'} />
                </>
            }
            {
                watchPropertyStatus === "Rented" &&
                <>
                    <FormSelect name="contractType" label="tipo de contrato" control={control} options={CONTRACT_TYPE} value={watchContractType} />
                    {watchContractType === "Verbal" && (
                        <RowTextAction text={'Gerar declaração de contrato verbal'} label={'gerar'} onClick={() => handlePropertyOwnerForm('verbal')} />
                    )}
                    <FormFilePicker name={'file_document'} control={control} accept={'application/pdf'} label={'contrato de aluguel'} />
                    <FilePreview file={watchFile} url={watch("url_document")} text={'visualizar contrato'} />

                </>
            }

        </div>
    )
})

export default PropertyStatus