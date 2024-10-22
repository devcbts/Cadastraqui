import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
import SentDocuments from "Components/SentDocuments"
import Table from "Components/Table"
import FormList from "Pages/SubscribeForm/components/FormList"
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import entityService from "services/entity/entityService"
import { NotificationService } from "services/notification"
import METADATA_TYPE_MAPPER from "utils/file/metadata-type-mapper"

export default function ApplicantsDocuments() {
    const { state } = useLocation()
    const [isLoading, setIsLoading] = useState(true)
    // documents : {member:string, documents: {metadata:{}, url: string, ...docprops}}[]
    const [data, setData] = useState([])
    useEffect(() => {
        if (!state.id) {
            return NotificationService.error({ text: 'Bolsista não encontrado' })
        }
        const fetchDocuments = async () => {
            try {
                setIsLoading(true)
                const information = await entityService.getScholarshipDocuments(state.id)
                setData(information)
            } catch (err) {
                NotificationService.error({ text: err?.response?.data?.message })
            }
            setIsLoading(false)
        }
        fetchDocuments()
    }, [state])
    const handleViewDocument = (url) => {
        window.open(url, '_blank')
    }
    return (
        <SentDocuments
            loading={isLoading}
            data={data}
            onViewDoc={handleViewDocument}
        />
    )
}