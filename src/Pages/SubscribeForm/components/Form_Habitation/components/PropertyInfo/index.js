import { useForm } from "react-hook-form";
import FormSelect from "Components/FormSelect";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "Components/InputForm";
import CONTRACT_TYPE from "utils/enums/contract-type";
import DOMICILE_TYPE from "utils/enums/domicile-type";
import propertyInfoSchema from "./schemas/property-info-schema";
import TIME_LIVING_PROPERTY from "utils/enums/time-living-property";
import NUMBER_ROOMS from "utils/enums/number-rooms";

const { forwardRef, useImperativeHandle } = require("react");

const PropertyInfo = forwardRef(({ data }, ref) => {
    const { control, watch, setValue, trigger, formState: { isValid }, getValues } = useForm({
        mode: "all",
        defaultValues: {
            domicileType: '',
            timeLivingInProperty: '',
            numberOfRooms: '',
            numberOfBedrooms: '',
        },
        values: data && {
            domicileType: data.domicileType,
            timeLivingInProperty: data.timeLivingInProperty,
            numberOfRooms: data.numberOfRooms,
            numberOfBedrooms: data.numberOfBedrooms,
        },
        resolver: zodResolver(propertyInfoSchema)
    })
    const watchDomicileType = watch("domicileType")
    const watchTime = watch("timeLivingInProperty")
    const watchRooms = watch("numberOfRooms")
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
            <FormSelect name="domicileType" label="status" control={control} options={DOMICILE_TYPE} value={watchDomicileType} />
            <FormSelect name="timeLivingInProperty" label="tempo vivendo na propriedade" control={control} options={TIME_LIVING_PROPERTY} value={watchTime} />
            <FormSelect name="numberOfRooms" label="quantidade de cômodos" control={control} options={NUMBER_ROOMS} value={watchRooms} />
            <InputForm
                control={control}
                name="numberOfBedrooms"
                label="quantos cômodos estão servindo permanentemente como dormitórios?"
                transform={(e) => {
                    if (!isNaN(parseInt(e.target.value))) {
                        return parseInt(e.target.value, 10)
                    }
                }}
            />

        </div>
    )
})

export default PropertyInfo