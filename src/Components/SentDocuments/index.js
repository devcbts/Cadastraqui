import BackPageTitle from "Components/BackPageTitle"
import ButtonBase from "Components/ButtonBase"
import Loader from "Components/Loader"
import Table from "Components/Table"
import METADATA_TYPE_MAPPER from "utils/file/metadata-type-mapper"

export default function SentDocuments({ data = [], loading = false, onViewDoc }) {
    return (
        <div style={{ padding: '24px' }}>
            <Loader loading={loading} />
            <BackPageTitle title={'Documentos enviados'} path={-1} />
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
                                            <ButtonBase label={'visualizar'} onClick={() => { onViewDoc(doc.url) }} />
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Root>
                        }
                    </div>
                )
            })}
        </div>
    )
}