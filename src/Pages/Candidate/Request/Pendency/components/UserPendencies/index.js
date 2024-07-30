import BackPageTitle from "Components/BackPageTitle";
import ButtonBase from "Components/ButtonBase";
import FormList from "Pages/SubscribeForm/components/FormList";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import candidateService from "services/candidate/candidateService";
import { NotificationService } from "services/notification";
import uploadService from "services/upload/uploadService";
import SendDocumentSolicitation from "../../SendDocumentSolicitation";

export default function UserPendencies() {
    const { applicationId } = useParams()
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const information = await candidateService.getCandidateSolicitationByApplication(applicationId)
                setData(information)
            } catch (err) { }
            setIsLoading(false)
        }
        fetchData()
    }, [applicationId])
    const [selection, setSelection] = useState(null)
    const handleSelection = (item) => {
        setSelection(item)
    }
    const handleUploadSolicitation = async (id, file) => {
        try {
            const formData = new FormData()
            formData.append("file", file)
            await uploadService.uploadCandidateSolicitation(id, formData)
            NotificationService.success({ text: 'Pendência enviada' })
            setData(prev => [...prev].map(e => {
                if (e.id === id) {
                    return ({ ...e, answered: true })
                }
                return e
            }))
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }
    return (
        <div>
            <SendDocumentSolicitation data={selection} onClose={() => setSelection(null)} onConfirm={handleUploadSolicitation} />
            <BackPageTitle title={'Solicitações'} path={'/solicitacoes'} />
            <h3>Pendências</h3>
            <div style={{ display: 'flex', placeContent: 'center', width: '100%' }}>
                <div style={{ display: 'flex', placeContent: 'center', width: '80%' }}>

                    <FormList.Root isLoading={isLoading}>
                        <FormList.List list={data}
                            text={'Você ainda não possui nenhuma pendência para este edital'}
                            render={(item) => {
                                if (item.solicitation === 'Document') {
                                    return (
                                        <FormListItem.Root text={item.description}>
                                            <FormListItem.Actions>
                                                {!item.answered
                                                    ? <ButtonBase label={'enviar'} onClick={() => handleSelection(item)} />
                                                    : <span>Enviada</span>
                                                }
                                            </FormListItem.Actions>
                                        </FormListItem.Root>
                                    )
                                } else if (item.solicitation === 'Interview' || item.solicitation === 'Visit') {
                                    return (
                                        <FormListItem.Root text={item.description}>
                                            <FormListItem.Actions>
                                                {!item.answered
                                                    ? <ButtonBase label={'agendar'} onClick={() => navigate('', { state: { schedule: item.solicitation } })} />
                                                    : <span>Enviada</span>
                                                }
                                            </FormListItem.Actions>
                                        </FormListItem.Root>
                                    )
                                }

                            }}
                        ></FormList.List>
                    </FormList.Root>
                </div>
            </div>
        </div>
    )
}