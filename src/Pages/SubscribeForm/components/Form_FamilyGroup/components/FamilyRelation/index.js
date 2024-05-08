import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "Components/FormSelect";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import familyRelationSchema from "./schemas/family-relation-schema";
import FAMILY_RELATIONSHIP from "utils/enums/family-relationship";
import InputForm from "Components/InputForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
const FamilyRelation = forwardRef(({ data }, ref) => {
    const { control, formState: { isValid }, trigger, getValues, watch } = useForm({
        mode: "all",
        defaultValues: {
            relationship: '',
            otherRelationship: '',
        },
        values: data && {
            relationship: data.relationship,
            otherRelationship: data.otherRelationship,
        },
        resolver: zodResolver(familyRelationSchema)
    })
    const watchRelationship = watch("relationship")
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues
    }))
    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Parentesco</h1>
            <div>
                <FormSelect
                    name="relationship"
                    control={control}
                    label={"parentesco"}
                    options={FAMILY_RELATIONSHIP}
                    value={watchRelationship}
                />
                {
                    watchRelationship === "Other" && (
                        <InputForm
                            name="otherRelationship"
                            control={control}
                            label="relação"

                        />
                    )
                }
            </div>

        </div>

    )
})

export default FamilyRelation