import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFetcher } from "react-router-dom";
export default function useForm(defaultValue = {}, validator = []) {
    const initializeAllNull = Object.keys(defaultValue).reduce((acc, key) => { acc[key] = null; return acc }, {})
    const [values, setValues] = useState(defaultValue);
    const [errors, setErrors] = useState(initializeAllNull)
    const validators =
        useMemo(() =>
            typeof validator === "function" ? validator(values) : validator, [values])

    const handleChange = (e) => {
        let { name, value, type, checked } = e.target
        if (type === "checkbox") {
            value = checked
        }
        setValues((prevState) => ({ ...prevState, [name]: value }))
        validateField(name, value)
    }
    const validateField = useCallback((field, value) => {
        let error;
        if (validators.length !== 0) {
            error = validators.validate(field, value)
            if (error) setErrors((prevState) => ({ ...prevState, [field]: error }))
            else setErrors((prevState) => ({ ...prevState, [field]: '' }))
        }
        console.log(field, error)
        return error
    }, [validators])
    /*  const isValidForm = useMemo(() => {
         return Object.keys(errors).every((e) => !errors[e])
     }, [errors])
  */
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
        submit,
        reset
    ]
}