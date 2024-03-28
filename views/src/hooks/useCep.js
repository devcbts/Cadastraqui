import { useEffect } from "react"
import getUserAddress from "../utils/get-user-address"
/**
 * 
 * @param {*} callback callback function with 1 argument (address)
 * @param {*} value value to be observed and, when changed, trigger (or not) the callback
 */
export default function useCep(callback, value) {
    useEffect(() => {
        const onlyDigitsCep = value.replace(/\D/g, '')
        const updateAddress = async () => {
            if (onlyDigitsCep.length === 8) {
                const address = await getUserAddress(onlyDigitsCep)
                callback(address)
            }

        }
        updateAddress()
    }, [value])

}