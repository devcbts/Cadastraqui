import { useForm } from "react-hook-form";
import FormSelect from "Components/FormSelect";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss';
import { zodResolver } from "@hookform/resolvers/zod";
import InputForm from "Components/InputForm";
import VEHICLE_TYPE from "utils/enums/vehicle-type";
import VEHICLE_USAGE from "utils/enums/vehicle-usage";
import Loader from "Components/Loader";
import candidateService from "services/candidate/candidateService";
import vehicleDataSchema from "./schemas/vehicle-data-schema";
import useControlForm from "hooks/useControlForm";

const { forwardRef, useImperativeHandle, useEffect, useState, useMemo } = require("react");

const VehicleData = forwardRef(({ data }, ref) => {
    const { control, watch, setValue } = useControlForm({
        schema: vehicleDataSchema,
        defaultValues: {
            vehicleType: '',
            modelAndBrand: '',
            manufacturingYear: '',
            usage: '',
            plate: '',
            document: '',
            owners_id: [],
            // Variable to avoid unnecessary fetch of family members (NOT TO BE USED ON FORM)
            members: []
        },
        initialData: data
    }, ref)

    const watchVehicleType = watch("vehicleType")
    const watchUsage = watch("usage")
    const watchOwners = watch("owners_id")
    const watchMembers = watch("members")
    const watchManufacturingYear = watch("manufacturingYear")


    const needFetching = data?.members ? data.members.length === 0 : true
    const [isLoading, setIsLoading] = useState(needFetching)

    const manufacturingYearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear()
        const minYear = 1950
        const maxYear = currentYear
        const options = []

        for (let year = maxYear; year >= minYear; year--) {
            options.push({ value: year, label: String(year) })
        }

        return options
    }, [])
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const familyGroup = await candidateService.getFamilyMembers({ includeSelf: true })
                if (familyGroup?.members) {
                    setValue("members", familyGroup.members.map(member => ({ value: member.id, label: member.fullName })))
                }
            } catch (err) {

            }
            setIsLoading(false)
        }
        if (needFetching) {
            fetchData()
        }

    }, [])



    return (
        <div className={commonStyles.formcontainer}>
            <Loader loading={isLoading} text="Carregando membros do grupo familiar" />
            <h1 className={commonStyles.title}>Dados do veículo</h1>
            <FormSelect name="owners_id" label="proprietários" control={control} options={watchMembers} value={watchOwners} multiple />
            <FormSelect name="vehicleType" label="tipo de veículo" control={control} options={VEHICLE_TYPE} value={watchVehicleType} />
            <InputForm control={control} name="modelAndBrand" label="marca e modelo" />
            <InputForm
                control={control}
                name="plate"
                label="Placa"
                maxLength={8}
                transform={(e) => e.target.value.toUpperCase().trim()}
            />
            <InputForm
                control={control}
                name="document"
                label="Renavam"
                maxLength={11}
                inputMode="numeric"
                pattern="\\d*"
                transform={(e) => e.target.value.replace(/\D/g, '')}
            />
            <FormSelect
                name="manufacturingYear"
                label="ano de fabricação"
                control={control}
                options={manufacturingYearOptions}
                value={watchManufacturingYear}
            />
            <FormSelect name="usage" label="tipo de veículo" control={control} options={VEHICLE_USAGE} value={watchUsage} />


        </div>
    )
})

export default VehicleData

