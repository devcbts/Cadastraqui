import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useImperativeHandle, useMemo } from "react";
import { useForm } from "react-hook-form";

export default function useControlForm({
    defaultValues = {},
    initialData = null,
    schema,
}, ref) {
    // default values is the 'schema' for the form data
    // iterate over it and, if initialData.field exists, put it on values instead of default,
    // else, use the initialData instead
    const populateValues = () => {
        if (!initialData) return defaultValues
        const initialFields = Object.entries(initialData ?? {})
        const fields = Object.entries(defaultValues)
        // copy all keys to the new obj,set if the initialData value is truthy
        let newObj = {};
        fields.forEach(([key, value]) => {
            const sameField = initialFields.find(([ikey, _]) => ikey === key)
            newObj = { ...newObj, [key]: sameField?.[1] ?? value }
        })
        return newObj
    }

    const form = useForm({
        mode: "all",
        defaultValues: defaultValues,
        values: populateValues(),
        resolver: zodResolver(schema)
    })
    const { control, trigger, formState: { isValid, dirtyFields }, getValues, handleSubmit } = form
    useImperativeHandle(ref, () => ({
        validate: () => {
            trigger();
            return isValid
        },
        values: getValues,
        // function to be executed before submitting the form, so zod can validate and parse the schema (e.g: use transform functionality)
        beforeSubmit: async () => {
            let values;
            await handleSubmit((v) => {
                values = v
            })()
            return values
        }
    }))
    return {
        ...form
    }
}