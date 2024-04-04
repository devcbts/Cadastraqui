import { useEffect } from "react"
import getCompanyCNPJ from "../utils/get-company-cnpj"
/**
 * 
 * @param {*} callback callback function with 1 argument (companyData)
 * @param {*} value value to be observed and, when changed, trigger (or not) the callback
 */
export default function useCnpj(callback, value) {
    useEffect(() => {
        const onlyDigitsCnpj = value.replace(/\D/g, '')
        const updateCompanyData = async () => {
            if (onlyDigitsCnpj.length === 14) {
                const company = await getCompanyCNPJ(onlyDigitsCnpj)
                if (company) callback(company)
            }

        }
        updateCompanyData()
    }, [value])

}