import { useForm } from "react-hook-form";
import propertyStatusSchema from "./schemas/property-status-schema";
import FormSelect from "Components/FormSelect";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { zodResolver } from "@hookform/resolvers/zod";
import PROPERTY_STATUS from "utils/enums/property-status";
import InputForm from "Components/InputForm";
import CONTRACT_TYPE from "utils/enums/contract-type";
import useControlForm from "hooks/useControlForm";
import FilePreview from "Components/FilePreview";
import FormFilePicker from "Components/FormFilePicker";
import HabitationDeclarationPDF from "../../../Form_Declarations/components/HabitationDeclarationPDF";
import RowTextAction from "Components/RowTextAction";
import PropertyOwner from "../PropertyOwner";
import GivenPropertyPDF from "../GivenPropertyPDF";

const { forwardRef, useEffect, useState } = require("react");

const PropertyStatus = forwardRef(({ data }, ref) => {
    const { control, watch, resetField } = useControlForm({
        schema: propertyStatusSchema,
        defaultValues: {
            propertyStatus: '',
            grantorName: null,
            contractType: null,
            file_document: null,
            url_document: null,
        },
        initialData: data
    }, ref)

    const watchPropertyStatus = watch("propertyStatus")
    const watchContractType = watch("contractType")
    const hasGrantorName = ["ProvidedByEmployer", "ProvidedByFamily", "ProvidedOtherWay"].includes(watchPropertyStatus)
    const declarationNeeded = ["ProvidedByFamily", "ProvidedOtherWay"].includes(watchPropertyStatus)
    const hasContractType = watchPropertyStatus === "Rented"
    useEffect(() => {
        if (!hasGrantorName) {
            resetField("grantorName", { defaultValue: null })
        }
        if (!hasContractType) {
            resetField("contractType", { defaultValue: null })
        }
    }, [watchPropertyStatus])
    const watchFile = watch("file_document")
    const [ownerForm, setOwnerForm] = useState(false)
    const handlePropertyOwnerForm = () => {
        setOwnerForm((prev) => !prev)
    }
    return (
        <div className={commonStyles.formcontainer}>
            <PropertyOwner show={ownerForm} onClose={handlePropertyOwnerForm} pdf={(data) => {


                return <GivenPropertyPDF owner={data} />
            }} />
            <h1 className={commonStyles.title}>Status da Propriedade</h1>
            <FormSelect name="propertyStatus" label="status" control={control} options={PROPERTY_STATUS} value={watchPropertyStatus} />
            {
                hasGrantorName &&
                <>
                    <InputForm control={control} name="grantorName" label="nome do cedente" />
                    {declarationNeeded && (
                        <RowTextAction text={'gerar declaração de imóvel cedido'} label={'gerar'} onClick={handlePropertyOwnerForm} />
                    )}
                    <FormFilePicker name={'file_document'} control={control} accept={'application/pdf'} label={'documento'} />
                    <FilePreview file={watchFile} url={data?.url_document} text={'visualizar documento'} />
                </>
            }
            {
                watchPropertyStatus === "Rented" &&
                <>
                    <FormSelect name="contractType" label="tipo de contrato" control={control} options={CONTRACT_TYPE} value={watchContractType} />
                    <FormFilePicker name={'file_document'} control={control} accept={'application/pdf'} label={'contrato de aluguel'} />
                    <FilePreview file={watchFile} url={data?.url_document} text={'visualizar contrato'} />
                </>
            }

        </div>
    )
})

export default PropertyStatus