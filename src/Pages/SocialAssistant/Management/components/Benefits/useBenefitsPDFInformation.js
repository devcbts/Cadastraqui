import { useEffect, useState } from "react";
import { NotificationService } from "services/notification";
import userServiceInstance from "services/user/userService";

export default function useBenefitsPDF(applicationId) {
    const [response, setResponse] = useState(null)
    const currentYear = new Date().getFullYear()
    useEffect(() => {
        console.log('app id', applicationId)
        const fetchInformation = async () => {
            try {
                const information = await userServiceInstance.getBenefitsInformation(applicationId)
                setResponse({ ...information, currentYear })
                // onLoad({ ...information, currentYear })
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
        }
        if (applicationId) { fetchInformation() }
        // if (!applicationId) onLoad(null)
    }, [applicationId])
    return response
}