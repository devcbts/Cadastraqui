import React, { useEffect, useMemo, useState } from "react";

export default function useForm(defaultValue = {}, validators = []) {
    const initializeAllNull = Object.keys(defaultValue).reduce((acc, key) => { acc[key] = null; return acc }, {})
    const [values, setValues] = useState(defaultValue);
    const [errors, setErrors] = useState(initializeAllNull)
    const handleChange = (e) => {
        const { name, value } = e.target
        setValues((prevState) => ({ ...prevState, [name]: value }))
        validateField(name, value)
    }
    const validateField = (field, value) => {
        let error;
        if (validators.length !== 0) {
            error = validators.validate(field, value)
            if (error) setErrors((prevState) => ({ ...prevState, [field]: error }))
            else setErrors((prevState) => ({ ...prevState, [field]: '' }))
        }
        return error
    }
    const isValidForm = useMemo(() => {
        return Object.keys(errors).every((e) => !errors[e])
    }, [errors])

    const submit = (...args) => {
        let submitErrors;
        if (!args || !args?.length) {
            submitErrors = Object.keys(values).map((key) => validateField(key, values[key]))
        } else {
            const onlyDataToValidate = Object.entries(values).filter((entry) => args.includes(entry[0]))
            submitErrors = onlyDataToValidate.map((entry) => validateField(entry[0], entry[1]))
        }
        return submitErrors.every((e) => !e);

    }

    const setMultipleValues = (obj) => {
        const currentKeys = Object.keys(values)
        Object.keys(obj).forEach((key) => !(key in currentKeys) && handleChange({ target: { name: key, value: obj[key] } }))

    }
    const reset = () => {
        setValues(defaultValue)
        setErrors(initializeAllNull)
    }
    return [
        [values, setMultipleValues],
        handleChange,
        errors,
        isValidForm,
        submit,
        reset
    ]
}