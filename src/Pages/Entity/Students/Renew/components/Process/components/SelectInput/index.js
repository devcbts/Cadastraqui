import { zodResolver } from "@hookform/resolvers/zod";
import FormSelect from "Components/FormSelect";
import InputBase from "Components/InputBase";
import InputForm from "Components/InputForm";
import SelectBase from "Components/SelectBase";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SelectInput({ type = "both", selectProps, inputProps, selected, name }) {
    const hasInput = type === "both" || type === "input"
    const hasSelect = type === "both" || type === "select"
    const { control, formState: { errors }, watch } = useForm({
        mode: "all",
        resolver: zodResolver(z.object({
            [`select-${name}`]: z.any().nullish().superRefine((v, ctx) => {
                if (!v && selected) {
                    ctx.addIssue({
                        message: 'Obrigatório',

                    })
                }
            }),
            [`input-${name}`]: z.string().nullish().superRefine((v, ctx) => {
                const num = Number(v)
                const valid = num !== 0 && !isNaN(num)
                if (selected && !valid) {
                    ctx.addIssue({
                        message: 'Obrigatório',
                    })
                }
            })
        })),
        defaultValues: {
            [`select-${name}`]: selectProps.value,
            [`input-${name}`]: inputProps.value,
        }
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
            {hasSelect && <FormSelect {...selectProps} name={`select-${name}`} control={control} value={watch(`select-${name}`)} />}
            {hasInput && <div style={{ width: '4.5rem' }}>
                <InputForm {...inputProps} name={`input-${name}`} control={control} showIcon={false} />
            </div>}
        </div>
    )
}