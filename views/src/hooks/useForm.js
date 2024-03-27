import React, { useEffect, useMemo, useState } from "react";

export default function useForm(defaultValue = {}, validators = []) {
    const [values, setValues] = useState(defaultValue);
    const [errors, setErrors] = useState(Object.keys(defaultValue).reduce((acc, key) => { acc[key] = ''; return acc }, {}))
    useEffect(() => {
        console.log('valores', values)
    }, [values])

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
    return [
        values,
        handleChange,
        errors,
        isValidForm
    ]
}