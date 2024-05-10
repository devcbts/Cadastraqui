import { useForm } from "react-hook-form";
import propertyStatusSchema from "./schemas/property-status-schema";
import FormSelect from "Components/FormSelect";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { zodResolver } from "@hookform/resolvers/zod";
import PROPERTY_STATUS from "utils/enums/property-status";
import InputForm from "Components/InputForm";
import CONTRACT_TYPE from "utils/enums/contract-type";

const { forwardRef, useImperativeHandle, useEffect } = require("react");

const PropertyStatus = forwardRef(({ data }, ref) => {
    const { control, watch, setValue, trigger, formState: { isValid }, getValues, resetField } = useForm({
        mode: "all",
        defaultValues: {
            propertyStatus: '',
            grantorName: null,
            contractType: null,
        },
        values: data && {
            propertyStatus: data.propertyStatus,
            grantorName: data.grantorName,
            contractType: data.contractType
        },
        resolver: zodResolver(propertyStatusSchema)
    })
    const watchPropertyStatus = watch("propertyStatus")
    const watchContractType = watch("contractType")
    const hasGrantorName = ["ProvidedByEmployer", "ProvidedByFamily", "ProvidedOtherWay"].includes(watchPropertyStatus)
    const hasContractType = watchPropertyStatus === "Rented"
    useEffect(() => {
        if (!hasGrantorName) {
            resetField("grantorName", { defaultValue: null })
        }
        if (hasContractType) {
            resetField("contractType", { defaultValue: null })
        }
    }, [watchPropertyStatus])
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues
    }))

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Status da Propriedade</h1>
            <FormSelect name="propertyStatus" label="status" control={control} options={PROPERTY_STATUS} value={watchPropertyStatus} />
            {
                hasGrantorName &&
                <InputForm control={control} name="grantorName" label="nome do cedente" />
            }
            {
                watchPropertyStatus === "Rented" &&
                <FormSelect name="contractType" label="tipo de contrato" control={control} options={CONTRACT_TYPE} value={watchContractType} />
            }

        </div>
    )
})

export default PropertyStatus