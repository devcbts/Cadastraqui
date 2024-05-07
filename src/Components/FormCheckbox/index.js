import { Controller } from "react-hook-form";
import CheckboxBase from "../CheckboxBase";

export default function FormCheckbox({ name, control, label }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                return (
                    <CheckboxBase
                        label={label}
                        {...field}
                        onChange={(_) => {
                            field.onChange(!field.value)
                        }}
                    />
                )
            }}
        />
    )
}