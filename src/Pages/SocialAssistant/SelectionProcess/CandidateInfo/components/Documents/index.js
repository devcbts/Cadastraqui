import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import styles from '../../styles.module.scss'
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { useEffect, useState } from "react";
import DocumentRequestModal from "../DocumentRequestModal";
import FormListItem from "Pages/SubscribeForm/components/FormList/FormListItem";
export default function Documents({ data, solicitations, onRequest }) {
    const [requests, setRequests] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const downloadFilesAsZip = async (name, files) => {
        const zip = new JSZip();
        const urls = Object.values(files).map((e) => {
            return Object.values(e)[0][0]
        })

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = url.split('#')[0].split('?')[0].split('/').pop();
            zip.file(filename, blob);
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, `documentos_${name}.zip`);
        });
    };
    const handleAddRequest = (newRequest) => {
        setRequests((prev) => ([...prev, { ...newRequest, index: new Date().getTime() }]))
    }
    const handleAddDocument = () => {
        setOpenModal((prev) => !prev)
    }
    const handleDeleteRequest = (id) => {
        setRequests((prev) => prev.filter(e => e.id !== id))
    }
    useEffect(() => {
        onRequest(requests)
    }, [requests])
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
                                    <ButtonBase label={'excluir'} danger onClick={() => handleDeleteRequest(request.index)} />
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