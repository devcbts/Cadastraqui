import Accordion from "Components/Accordion"
import { useMemo } from "react"
import CnpjCard from "./CnpjCard"
import ResponsibleCpf from "./ResponsibleCpf"

export default function EntityLegalFiles() {
    const config = useMemo(() => [
        { title: 'CPF dos responsáveis', Component: ResponsibleCpf },
        { title: 'Cartão do CNPJ', Component: CnpjCard },
    ], [])

    return (
        <>
            <h1>Arquivos da Instituição</h1>
            {config.map((e, i) => (
                <div style={{ marginBottom: 16 }}>

                    <Accordion key={e.title} title={e.title} >
                        <e.Component />
                    </Accordion>
                </div>
            ))}
        </>
    )
}