import { useEffect, useRef, useState } from "react"
import getUserAddress from "../utils/get-user-address"
import validateCEP from "../utils/validate-cep"
/**
 * 
 * @param {*} callback callback function with 1 argument (address)
 * @param {*} value value to be observed and, when changed, trigger (or not) the callback
 */
export default function useCep(callback, value) {
    // Ignore when cep already starts completed (example: Editing screens)
    const [ignoreWhenEqual, setIgnoreWhenEqual] = useState(value)
    const isMounted = useRef(null)
    useEffect(() => {
        if (!isMounted.current && validateCEP(ignoreWhenEqual)) {
            setIgnoreWhenEqual("")
            isMounted.current = true
            return
        }
        const updateAddress = async () => {
            if (validateCEP(value)) {
                const address = await getUserAddress(value.replace(/\D/g, ''))
                callback(address)
            }

        }
        updateAddress()
    }, [value])

}