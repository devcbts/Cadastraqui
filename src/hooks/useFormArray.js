import { useCallback, useEffect, useState } from "react";
import useForm from "./useForm";

export default function useFormArray({ defaultValues = [], initialLength }, validations) {
    const [array, setArray] = useState(defaultValues)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [errors, setErrors] = useState(Array.from({ length: initialLength ?? 0 }).map(_ => Object.keys(defaultValues?.[0])))
    // Useform to perform validations
    const [[obj], handleChangeField, fieldErrors] = useForm(defaultValues?.[currentIndex], validations)

    useEffect(() => {
        setArray((prevState) => prevState.map((e, index) => index === currentIndex ? obj : e))
    }, [obj])
    useEffect(() => {
        setErrors((prevState) => prevState.map((e, index) => index === currentIndex ? fieldErrors : e))
    }, [fieldErrors])
    const handleChange = (event, index) => {
        setCurrentIndex(index)
        handleChangeField(event)
    }

    return [
        array,
        handleChange,
        errors,
    ]
}