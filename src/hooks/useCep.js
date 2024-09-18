import { useEffect, useRef, useState } from "react"
import getUserAddress from "../utils/get-user-address"
import validateCEP from "../utils/validate-cep"
/**
 * 
 * @param {*} callback callback function with 1 argument (address)
 * @param {*} value value to be observed and, when changed, trigger (or not) the callback
 */
export default function useCep(callback, value) {

    const isMounted = useRef(null)
    // keep track of the initial CEP value (IF IT EXISTS)
    const wasInitialized = useRef(null)
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true
            return
        }
        // if null, then it wasn't initialized yet
        if (wasInitialized.current === null) {
            // if validateCEP(value) equals true, then value is already correct and should NOT call API
            if (validateCEP(value)) {
                wasInitialized.current = value
            } else {
                // if validateCEP(value) equals false, it means it's first value change/should call API
                wasInitialized.current = ''
            }
        }
        const updateAddress = async () => {
            const address = await getUserAddress(value?.replace(/\D/g, ''))
            callback(address)
        }
        if (validateCEP(value)) {
            if (value !== wasInitialized.current) {
                updateAddress()
                wasInitialized.current = ''
            }
        }
    }, [value])
    // useEffect(() => {

    //     const updateAddress = async () => {
    //         if (validateCEP(value)) {
    //             const address = await getUserAddress(value?.replace(/\D/g, ''))
    //             callback(address)
    //         }

    //     }
    //     updateAddress()
    // }, [value])

}