import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
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
        <div style={{ padding: '24px' }}>
            <Loader loading={isLoading} />
            <h2>Documentos enviados</h2>
            {data.map(e => {
                const { documents } = e
                return (
                    <div style={{ minWidth: '280px', maxWidth: '50%', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h4 style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                            Nome:
                            <span style={{ border: '2px solid #1F4B73', padding: '4px', borderRadius: '8px', width: "70%", textAlign: 'left' }}>{e.member}</span>
                        </h4>
                        {
                            <Table.Root>
                                {documents.map((doc, i) => (
                                    <Table.Row key={doc.id}>
                                        <Table.Cell divider>{i + 1}</Table.Cell>
                                        <Table.Cell>{METADATA_TYPE_MAPPER[doc.metadata.type]}</Table.Cell>
                                        <Table.Cell>
                                            <ButtonBase label={'visualizar'} onClick={() => { handleViewDocument(doc.url) }} />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Root>
                        }
                    </div>
                )
            })}
            {/* <FormList.List
                list={documents}
                render={(item) => {
                    const { documents } = item
                    return (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
                            <h4>Nome: {item.member}</h4>
                            <div>
                                {documents.map(doc => (
                                    <FormListItem.Root
                                        text={METADATA_TYPE_MAPPER[doc.metadata.type]}
                                        key={doc.id}>
                                        <FormListItem.Actions>
                                            <ButtonBase label={'visualizar'} onClick={() => { handleViewDocument(doc.url) }} />
                                        </FormListItem.Actions>
                                    </FormListItem.Root>

                                ))}
                            </div>
                        </div>)
                }}>

            </FormList.List> */}

        </div>
    )
}