import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import styles from '../../styles.module.scss'
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { useEffect, useState } from "react";
import DocumentRequestModal from "../DocumentRequestModal";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
import FilePreview from "Components/FilePreview";
import socialAssistantService from "services/socialAssistant/socialAssistantService";
import { useLocation } from "react-router";
import { NotificationService } from "services/notification";
export default function Documents({ data, solicitations, }) {
    const [requests, setRequests] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const { state } = useLocation()
    const downloadFilesAsZip = async (name, files) => {
        try {

            const zip = new JSZip();
            const urls = Object.values(files).map((e) => {
                return Object.values(e)
            })

            for (let i = 0; i < urls.length; i++) {
                const zipUrls = urls[i];
                for (let j = 0; j < zipUrls.length; j++) {
                    const url = zipUrls[j][0]
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const filename = url.split('#')[0].split('?')[0].split('/').pop();
                    zip.file(filename, blob);
                }
            }

            zip.generateAsync({ type: 'blob' }).then((content) => {
                saveAs(content, `documentos_${name}.zip`);
            });
        } catch (err) { }
    };
    const handleAddRequest = async (req) => {
        try {
            const id = await socialAssistantService.registerSolicitation(state?.applicationId, req)

            const newRequest = { ...req, id }
            setRequests((prev) => {
                const newArr = [...prev, newRequest]
                return newArr
            })
        } catch (err) {
            NotificationService.error({ text: 'Falha ao criar solicitação' })
        }
    }
    const handleAddDocument = () => {
        setOpenModal((prev) => !prev)
    }
    const handleDeleteRequest = async (id) => {
        try {
            await socialAssistantService.deleteSolicitation(state?.applicationId, id)
            setRequests((prev) => {
                const newArr = prev.filter(e => e.id !== id)
                return newArr
            })
        } catch (err) {
            NotificationService.error({ text: err?.response?.data?.message })
        }
    }

    useEffect(() => {
        setRequests(solicitations)
    }, [solicitations])
    return (
        <div className={styles.table}>
            <DocumentRequestModal open={openModal} onClose={handleAddDocument} onConfirm={handleAddRequest} />
            <h3>Documentos</h3>
            <Table.Root headers={['integrante', 'ações']}>
                {data?.map((item) => {
                    return (
                        <Table.Row>
                            <Table.Cell>{item.member}</Table.Cell>
                            <Table.Cell>
                                <ButtonBase label={'baixar'} onClick={() => downloadFilesAsZip(item.member, item.documents)} />
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Root>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '12px 0px' }}>

                <ButtonBase label={'solicitar documento'} onClick={handleAddDocument} />

                {!!requests.length && (
                    <div style={{ marginTop: '24px', width: '80%' }}>
                        {requests.map((request) => (
                            <FormListItem.Root text={request.description}>
                                <FormListItem.Actions>

                                    {request.answered
                                        ? <FilePreview url={request.url} text={'ver documento'} />
                                        :
                                        <>
                                            <span>Aguardando envio</span>
                                            <ButtonBase label={'excluir'} danger onClick={() => handleDeleteRequest(request.id)} />
                                        </>}


                                </FormListItem.Actions>
                            </FormListItem.Root>
                        )
                        )}
                    </div>
                )
                }
            </div>
        </div>
    )
}