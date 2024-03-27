import { useEffect } from "react"

export default function useCep(cep) {
    useEffect(() => {
        const onlyDigitsCep = cep.replace(/\D/g, '')
        const updateAddress = async () => {
            if (cep.length === 8) {
                const address = await getUserAddress(onlyDigitsCep)
                handleRegisterInfoChange({ target: {} })
            }

        }
        updateAddress()
    }, [cep])
}