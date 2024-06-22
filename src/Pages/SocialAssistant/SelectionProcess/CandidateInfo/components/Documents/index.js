import ButtonBase from "Components/ButtonBase";
import Table from "Components/Table";
import styles from '../../styles.module.scss'
import JSZip from "jszip";
import { saveAs } from 'file-saver';
export default function Documents({ data }) {
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
    return (
        <div className={styles.table}>
            <h3>Documentos</h3>
            <Table.Root headers={['integrante', 'ações']}>
                {data?.map((item) => {
                    // get first item, since it's returning duplicate (FIX LATER)
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
        </div>
    )
}