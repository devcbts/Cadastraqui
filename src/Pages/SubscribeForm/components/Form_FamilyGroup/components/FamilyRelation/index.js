import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "Components/FormSelect";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import familyRelationSchema from "./schemas/family-relation-schema";
import FAMILY_RELATIONSHIP from "utils/enums/family-relationship";
import InputForm from "Components/InputForm";
import commonStyles from 'Pages/SubscribeForm/styles.module.scss'
import useControlForm from "hooks/useControlForm";
const FamilyRelation = forwardRef(({ data }, ref) => {
    const { control, watch } = useControlForm({
        schema: familyRelationSchema,
        defaultValues: {
            relationship: '',
            otherRelationship: '',
        },
        initialData: data
    }, ref)

    const watchRelationship = watch("relationship")

    return (
        <div className={commonStyles.formcontainer}>
            <h1 className={commonStyles.title}>Parentesco</h1>
            <>
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
            </>

        </div>

    )
})

export default FamilyRelation